var socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');

socket.on('enterRoom', function(roomname){
    console.log("ENTERED ROOM: " + roomname);
});
socket.on('newUser', function(username){
    pushUserName(username);
    joinedUser(username);
})

function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}

function joinedUser(username){
    var el = document.getElementById("joined");
    el.innerHTML += username + ' has joined the room <br/>';
}
