var expect = require('chai').expect
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';

var roomData;

describe('New Connection',function(){
    beforeEach(function (done) {
        roomData = {
            roomname: 'supimpa',
            username: 'max'
        } 
        server = require('../app').server;
        done();
    });

    it('should emit refreshCurrentUsers event to the client containing a user with name property equals to max and score equals to 0', function(done) {
        var client = io.connect('http://localhost:3000');

        client.on('connect', function () {
            client.on('refreshCurrentUsers', function (users) {
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

    it('should fire userJoined event to all users but the user the has just joined', function(done){
        var client = io.connect('http://localhost:3000');
        var client2 = io.connect('http://localhost:3000');
        var client3 = io.connect('http://localhost:3000');
        client.on('connect', function(){
            client2.send(roomData);
            client2.on('connect', function(){
                client.on('userJoined', function(data){
                    expect(data.username).to.equal(roomData.username);
                    expect(data.roomname).to.equal(roomData.roomname);
                    client2.disconnect();
                });
            });

            client3.send(roomData);
            client3.on('connect', function(){
                client2.on('userJoined', function(data){
                    expect(data.username).to.equal(roomData.username);
                    expect(data.roomname).to.equal(roomData.roomname);
                    client2.disconnect();
                    client.disconnect();
                })
            });
        });
        client.send(roomData);
        done();


    });
});
