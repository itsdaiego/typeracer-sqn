var express = require('express');

var app = express();
var server = app.listen(3000);

var socket = require('socket.io');
var io = socket(server);

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

var users  = {};

io.sockets.on('connection', function (socket) {
    socket.on('joinedRoom', function(roomData){
        socket.username = roomData.username;
        socket.room = roomData.roomname;
        
        console.log("Roomname: " + socket.room);
        console.log("Username: " + socket.username);

        socket.join(socket.room);
        socket.broadcast.to(socket.room).emit('newUser', socket.username);

        socket.on('disconnect', function(){
            socket.broadcast.emit('userLeft', socket.username);
            socket.leave(socket.room);

            console.log('Connection id: ' + socket.id);
        });
    });
});


