var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:5000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'name':'Tom'};
var chatUser2 = {'name':'Sally'};
var chatUser3 = {'name':'Dana'};

describe("Chat Server",function(){
    it('should return true', function() {
        should(1).be.exactly(1)
    });
    it('should return false', function() {
        should(1).be.exactly(0)
    });

});
