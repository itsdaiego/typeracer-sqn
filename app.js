"use strict"

var express = require('express')
var socket = require('socket.io')

var app = express()
var server = app.listen(3000) 
var gameModel = require('./models/game.js')
var roomModel = require('./models/room.js')
var sentences = require('./public/sentences.js')
var io = require('./socket.js').startServer(server, roomModel, gameModel, sentences)

app.set('view engine', 'jade')
app.use(express.static(__dirname + '/views'))

app.get('/', function(re, res){
    res.render('index')
})

app.get('/room/:roomname/status', function(req, res){
    var currentRoom = io.sockets.adapter.rooms[req.params.roomname] ? io.sockets.adapter.rooms[req.params.roomname] : undefined
    var roomInfo = {}
    if(!currentRoom){
        currentRoom = "Room does not exist!"
        res.send(currentRoom)
    }
    else{
        roomInfo.active_users = roomModel.getRoomActiveUsers(currentRoom)
        roomInfo.keystrokes = currentRoom.totalKeystrokes
        roomInfo.active_since = roomModel.getSecondsSinceRoomWasCreated(currentRoom)
        var meanScore = roomModel.getMeanScore(currentRoom)
        roomInfo.below_mean = roomModel.getBelowMeanUsers(meanScore, currentRoom)
        roomInfo.ranking = roomModel.getUsersRanking(currentRoom)
        roomInfo.last_minute_lead = currentRoom.finalWinner.username
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(roomInfo))
    }
})

app.get('/room/:roomname/user/:username', function(req, res){
    var room = {
        username: req.params.username,
        roomname: req.params.roomname
    }
    res.render('room', room)
})


