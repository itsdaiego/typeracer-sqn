var expect = require('chai').expect
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';

var roomData;

describe("New Connection",function(){
    beforeEach(function (done) {
        server = require('../app').server;
        done();
    });

    it('should emit refreshCurrentUsers event to the client containing a user with name property equals to max and score equals to 0', function(done) {
        roomData = {
            roomname: 'supimpa',
            username: 'max'
        } 
        var client = io.connect("http://localhost:3000");

        client.on("connect", function () {
            client.on("refreshCurrentUsers", function (users) {
                for(var prop in users){
                    expect(users[prop].score).to.equal(0);
                    expect(users[prop].name).to.equal('max');
                }
                done();
                client.disconnect();
            });

            client.send(roomData);
        });
    });
});
