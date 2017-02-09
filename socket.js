"use strict"

var socket = require('socket.io')

module.exports.startServer = function(server, roomModel, gameModel, sentences){
    var sentences = sentences.getEnglishSentences()
    var io = socket(server)
    io.sockets.on('connection', function (socket) {
        var currentRoom
        socket.on('message', function(roomData){
            gameModel.setConnectionProperties(socket, currentRoom, roomData)

            socket.join(socket.room)


            currentRoom = io.sockets.adapter.rooms[roomData.roomname]
            gameModel.setCurrentRoomProperties(currentRoom, socket)

            io.sockets.in(socket.room).emit('refreshCurrentUsers', currentRoom.users)
            socket.broadcast.to(socket.room).emit('userJoined', {
                username: socket.username,
                roomname: socket.room
            })

        })

        socket.on('userReady', function(roomData){
            currentRoom.usersReady++
            if(currentRoom.usersReady == currentRoom.length){
                io.sockets.in(socket.room).emit('startGame')
                io.sockets.in(socket.room).emit('newSentence', sentences[socket.sentenceCounter])

                io.sockets.in(socket.room).emit('timeRemaining', currentRoom.gameDuration)
                var intervalId = setInterval(function(){
                    currentRoom.roundTimeCounter++
                    currentRoom.gameDuration--
                    if(currentRoom.roundTime == currentRoom.roundTimeCounter){
                        roomModel.resetRoomCounters(currentRoom)

                        roomModel.setTotalKeystrokes(currentRoom)
                        gameModel.setFinalWinner(currentRoom)
                        io.sockets.in(socket.room).emit('roundFinished')

                    }
                    if(currentRoom.gameDuration <= 0){
                        clearInterval(intervalId)
                        socket.emit('gameFinished', currentRoom.finalWinner)
                    }
                    else{
                        io.sockets.in(socket.room).emit('timeRemaining', currentRoom.gameDuration)
                    }

                }, 1000)
            }
        })

        socket.on('resetScore', function(username){
            socket.score = 0
        })

        socket.on('sendPlayerScore', function(username){
            socket.score++
            currentRoom.users[socket.id].score = socket.score
            gameModel.setCurrentWinner(currentRoom, socket)
            gameModel.updateScore(io, socket)
        })

        socket.on('sentenceFinished', function(){
            socket.sentenceCounter++
            if(socket.sentenceCounter == sentences.length){
                socket.sentenceCounter = 0
            }
            socket.emit('newSentence', sentences[socket.sentenceCounter])
        })

        socket.on('disconnect', function(){
            if(socket.id && currentRoom){
                currentRoom.usersReady--
                socket.leave(socket.room)
                delete currentRoom.users[socket.id]
                io.sockets.in(socket.room).emit('userLeft', socket.username, currentRoom.users)
                io.sockets.in(socket.room).emit('refreshCurrentUsers', currentRoom.users)

            }
        })

    })


    return io
}

