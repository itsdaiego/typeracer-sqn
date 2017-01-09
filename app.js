var express = require('express');

var app = express();
var server = app.listen(3000);

var socket = require('socket.io');
var io = socket(server);

var roomModel = require('./models/room');

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
    
    io.sockets.emit('newUser', room)
    res.render('room', room);
});

io.sockets.on('connection', function (socket) {
    var ioRoom = io.of(socket.roomname);
});

