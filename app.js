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

    io.sockets.on('connection', function (socket) {
        socket.username = req.params.username;
        socket.roomname = req.params.roomname;

        socket.emit('welcome', room)
        var ioRoom = io.of('/' + socket.roomname)

        ioRoom.emit('newUser', socket.username);

    });
    
    res.render('room', room);
});

