var socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');

socket.on('welcome', function(data){
    pushUserName(data.username); 
    joinedUser(data.username); 
    ioRoom = io('/' + data.roomname);
    ioRoom.on('newUser', function(username){
    });
});

function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}

function joinedUser(username){
    var el = document.getElementById("joined");
    el.innerHTML += username + ' has joined the room <br/>';
}
