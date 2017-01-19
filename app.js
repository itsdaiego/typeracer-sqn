var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

var io = socket(server);

var english = require('./public/english.js');
var gameModel = require('./models/game.js');
var roomModel = require('./models/room.js');

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));

app.get('/', function(re, res){
    res.render('index');
});

app.get('/room/:roomname/status', function(req, res){
    var currentRoom = io.sockets.adapter.rooms[req.params.roomname] ? io.sockets.adapter.rooms[req.params.roomname] : undefined;
    var roomInfo = {};
    if(!currentRoom){
        currentRoom = "Room does not exist!";
        res.send(currentRoom);
    }
    else{
        roomInfo.active_users = roomModel.getRoomActiveUsers(currentRoom);
        roomInfo.keystrokes = currentRoom.totalKeystrokes;
        roomInfo.active_since = roomModel.getSecondsSinceRoomWasCreated(currentRoom);
        var meanScore = roomModel.getMeanScore(currentRoom);
        roomInfo.belo_mean = roomModel.getBelowMeanUsers(meanScore, currentRoom);
        roomInfo.ranking = roomModel.getUsersRanking(currentRoom);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(roomInfo));
    }
});

app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    };
    res.render('room', room);
});

var sentences = english.getEnglishSentences();
const roundTime = 5;

io.sockets.on('connection', function (socket) {
    var currentRoom;
    socket.on('message', function(roomData){
        gameModel.setConnectionProperties(socket, currentRoom, roomData);

        socket.emit('userInfo', roomData);
        socket.join(socket.room);


        currentRoom = io.sockets.adapter.rooms[roomData.roomname];
        gameModel.setCurrentRoomProperties(currentRoom, socket);
        
        io.sockets.in(socket.room).emit('refreshCurrentUsers', currentRoom.users);
        socket.broadcast.to(socket.room).emit('userJoined', {
            username: socket.username,
            roomname: socket.roomname
        });

    });
    
    socket.on('userReady', function(roomData){
        currentRoom.usersReady++;
        if(currentRoom.usersReady == currentRoom.length){
            io.sockets.in(socket.room).emit('startGame');
            io.sockets.in(socket.room).emit('newSentence', sentences[socket.sentenceCounter]);

            io.sockets.in(socket.room).emit('timeRemaining', currentRoom.gameDuration);
            var intervalId = setInterval(function(){
                currentRoom.roundTimeCounter++;
                currentRoom.gameDuration--;
                if(roundTime == currentRoom.roundTimeCounter){
                    currentRoom.roundTimeCounter = 0;
                    var scoreData  = {
                        username: socket.username,
                        score: socket.score
                    };
                    currentRoom.totalKeystrokes = 0;
                    roomModel.setTotalKeystrokes(currentRoom);
                    gameModel.setFinalWinner(currentRoom, scoreData);
                }
                if(currentRoom.gameDuration <= 0){
                    clearInterval(intervalId);
                    socket.emit('gameFinished', currentRoom.currentWinner);
                }
                else{
                    io.sockets.in(socket.room).emit('timeRemaining', currentRoom.gameDuration);
                }
        
            }, 1000);
        }
    });
    
    socket.on('sendPlayerScore', function(username){
        var scoreData  = {
            username: socket.username,
            score: socket.score
        };
        socket.score++;
        currentRoom.users[socket.id].score = socket.score;
        gameModel.setCurrentWinner(currentRoom, scoreData);
        io.sockets.in(socket.room).emit('updateScore', scoreData);
    });

    socket.on('sentenceFinished', function(){
        socket.sentenceCounter++;
        socket.emit('newSentence', sentences[socket.sentenceCounter]);
    });

    socket.on('disconnect', function(){
        if(socket.id && currentRoom){
            currentRoom.usersReady--;
            socket.leave(socket.room);
            delete currentRoom.users[socket.id];
            io.sockets.in(socket.room).emit('userLeft', socket.username, currentRoom.users);
            io.sockets.in(socket.room).emit('refreshCurrentUsers', currentRoom.users);

        }
    });

});

