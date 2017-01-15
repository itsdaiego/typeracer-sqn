var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

var io = socket(server);

var english = require('./public/english.js');
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
io.sockets.on('connection', function (socket) {
    socket.on('joinedRoom', function(roomData){
        socket.username = roomData.username;
        socket.room = roomData.roomname;
        socket.score = 0;
        var user = {
            name: roomData.username,
            score: 0
        };

        socket.emit('userInfo', roomData);

        users[socket.id] = user;

        socket.join(socket.room);
        io.sockets.in(socket.room).emit('refreshCurrentUsers', users);
        socket.broadcast.to(socket.room).emit('userJoined', socket.username);

    });

    setTimeout(function(){
        var sentences = english.getEnglishSentences();
        socket.emit('startGame');
        socket.emit('sentence', sentences[0]);
    }, 1000);

    socket.on('sendPlayerScore', function(username){
        socket.score++;
        var scoreData  = {
            username: username,
            score: socket.score
        };
        io.sockets.in(socket.room).emit('updateScore', scoreData);
    });

    socket.on('disconnect', function(){
        console.log("user left: " + JSON.stringify(users[socket.id]));
        socket.leave(socket.room);
        delete users[socket.id];
        io.sockets.in(socket.room).emit('userLeft', socket.username, users);
        io.sockets.in(socket.room).emit('refreshCurrentUsers', users);
    });

});

