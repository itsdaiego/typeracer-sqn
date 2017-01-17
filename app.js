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

var users = {};
var userReadyCounter = 0;
var gameDuration = 0;
var sentences = english.getEnglishSentences();
var highestScore = 0;
var gameDuration = 20;

io.sockets.on('connection', function (socket) {
    var connectionData = {};
    socket.on('message', function(roomData){
        console.log("ROOM: " + JSON.stringify(roomData));
        connectionData.username = roomData.username;
        connectionData.room = roomData.roomname;
        connectionData.sentenceCounter = 0;
        connectionData.score = 0;
        var user = {
            name: connectionData.username,
            score: 0
        };

        socket.emit('userInfo', roomData);

        users[socket.id] = user;
        socket.join(connectionData.room);
        io.sockets.in(connectionData.room).emit('refreshCurrentUsers', users);
        socket.broadcast.to(connectionData.room).emit('userJoined', {
            username: connectionData.username,
            roomname: connectionData.roomname
        });

    });
    
    socket.on('userReady', function(roomData){
        console.log("users ready: " + userReadyCounter); 
        console.log("rooms length" + io.sockets.adapter.rooms[connectionData.room].length); 
        if(roomData.roomname === connectionData.room){
            userReadyCounter++;
        }
        if(userReadyCounter == io.sockets.adapter.rooms[connectionData.room].length){
            io.sockets.in(connectionData.room).emit('startGame');
            io.sockets.in(connectionData.room).emit('newSentence', sentences[connectionData.sentenceCounter]);

            io.sockets.in(connectionData.room).emit('timeRemaining', gameDuration);
            var intervalId = setInterval(function(){
               gameDuration--;
                if(gameDuration <= 0){
                    clearInterval(intervalId);
                    var scoreData = engine.getCurrentWinner();
                    socket.emit('gameFinished', scoreData);
                }
                else{
                    io.sockets.in(connectionData.room).emit('timeRemaining', gameDuration);
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

        engine.setCurrentWinner(scoreData);
        io.sockets.in(connectionData.room).emit('updateScore', scoreData);
    });

    socket.on('sentenceFinished', function(){
        connectionData.sentenceCounter++;
        socket.emit('newSentence', sentences[connectionData.sentenceCounter]);
    });

    socket.on('disconnect', function(){
        userReadyCounter = userReadyCounter >= 0 ? userReadyCounter-- : userReadyCounter;
        console.log("users ready --: " + userReadyCounter);
        socket.leave(connectionData.room);
        delete users[socket.id];
        io.sockets.in(connectionData.room).emit('userLeft', connectionData.username, users);
        io.sockets.in(connectionData.room).emit('refreshCurrentUsers', users);
    });

});

