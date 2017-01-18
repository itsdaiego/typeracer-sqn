var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

var io = socket(server);

var english = require('./public/english.js');
var engine = require('./models/engine.js');

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));

app.get('/', function(re, res){
    res.render('index');
});


app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    };
    res.render('room', room);
});

var userReadyCounter = 0;
var sentences = english.getEnglishSentences();
var highestScore = 0;

io.sockets.on('connection', function (socket) {
    var connectionData = {};
    var currentRoom;
    socket.on('message', function(roomData){
        connectionData.username = roomData.username;
        connectionData.room = roomData.roomname;
        connectionData.sentenceCounter = 0;
        connectionData.score = 0;
        var user = {
            name: connectionData.username,
            score: 0
        };

        socket.emit('userInfo', roomData);

        socket.join(connectionData.room);


        currentRoom = io.sockets.adapter.rooms[roomData.roomname];
        if(!currentRoom.users){
            currentRoom.users = {};
        }
        currentRoom.usersReady = 0;
        currentRoom.currentWinner = 0;
        currentRoom.gameDuration = 5;
        currentRoom.users[socket.id] = user;

        io.sockets.in(connectionData.room).emit('refreshCurrentUsers', currentRoom.users);
        socket.broadcast.to(connectionData.room).emit('userJoined', {
            username: connectionData.username,
            roomname: connectionData.roomname
        });

    });
    
    socket.on('userReady', function(roomData){
        currentRoom.usersReady++;
        if(currentRoom.usersReady == currentRoom.length){
            io.sockets.in(connectionData.room).emit('startGame');
            io.sockets.in(connectionData.room).emit('newSentence', sentences[connectionData.sentenceCounter]);

            io.sockets.in(connectionData.room).emit('timeRemaining', currentRoom.gameDuration);
            var intervalId = setInterval(function(){
               currentRoom.gameDuration--;
                if(currentRoom.gameDuration <= 0){
                    clearInterval(intervalId);
                    socket.emit('gameFinished', currentRoom.currentWinner);
                }
                else{
                    io.sockets.in(connectionData.room).emit('timeRemaining', currentRoom.gameDuration);
                }
            }, 1000);
        }
    });


    socket.on('sendPlayerScore', function(username){
        connectionData.score++;
        
        var scoreData  = {
            username: username,
            score: connectionData.score
        };

        currentRoom.currentWinner = scoreData.score > currentRoom.currentWinner ? scoreData : currentRoom.currentWinner;
        io.sockets.in(connectionData.room).emit('updateScore', scoreData);
    });

    socket.on('sentenceFinished', function(){
        connectionData.sentenceCounter++;
        socket.emit('newSentence', sentences[connectionData.sentenceCounter]);
    });

    socket.on('disconnect', function(){
        if(socket.id && currentRoom){
            userReadyCounter = userReadyCounter >= 0 ? userReadyCounter-- : userReadyCounter;
            socket.leave(connectionData.room);
            delete currentRoom.users[socket.id];
            io.sockets.in(connectionData.room).emit('userLeft', connectionData.username, currentRoom.users);
            io.sockets.in(connectionData.room).emit('refreshCurrentUsers', currentRoom.users);

        }
    });

});

