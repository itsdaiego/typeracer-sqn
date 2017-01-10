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

var roomname;
var username;
app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    };
    roomname = room.roomname;
    username = room.username;
    res.render('room', room);
});

var users  = {};

io.sockets.on('connection', function (socket) {
    socket.username = username;
    socket.room = roomname;
    users[username] = username;
    console.log("joining room: " + roomname);
    socket.join(roomname);
    console.log("emiting to room: " + roomname);
    socket.broadcast.to(roomname).emit('newUser', username);

});


