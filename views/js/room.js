var roomData, socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');

socket.on('newUser', function(data){
    var roomData = data;
    var roomname = '/' + roomData.roomname; 
    ioRoom = io(roomname);
    pushUserName(data.username);
    joinedUser(data.username);
});



function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}

function joinedUser(username){
    var el = document.getElementById("joined");
    el.innerHTML += username + 'has joined the room <br/>';
}
