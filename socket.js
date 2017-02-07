"use strict"

var socket = require('socket.io')

module.exports.startServer = function(server){
    var io = socket(server)

    return io
}

