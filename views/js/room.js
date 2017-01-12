var socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');

socket.on('enterRoom', function(roomname){
    console.log("ENTERED ROOM: " + roomname);
});

socket.on('newUser', function(username){
    pushUserName(username);
    pushUserStatus(username, ' has joined the room <br/>');
});

socket.on('newRoom', function(data){
    alert(data);
});

socket.on('userLeft', function(username){
    pushUserStatus(username, ' has left the room <br/>');
});


function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}

function pushUserStatus(username, message){
    var el = document.getElementById("joined");
    el.innerHTML += username + message;
}
