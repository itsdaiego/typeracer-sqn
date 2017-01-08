var express = require('express');

var app = express();
var server = app.listen(3000);

var socket = require('socket.io');
var io = socket(server);

var roomData = require('./models/room');

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/views'));

app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    };

    roomData.setRoomData(room);
    res.render('room', room);
});

io.sockets.on('connection', function (socket) {
    var data = roomData.getRoomData();
    socket.emit('welcome', { content: data }); 
    socket.broadcast.emit('welcome', { content: data }); 
});

