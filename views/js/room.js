var data, socket, roomname;
var socket = io.connect('http://localhost:3000');

socket.on('welcome', function(data){
    var data = data;
    var roomname = "/" + data.roomname; 
    pushUserName(data.username);
    joinedUser(data.username);

    socket.emit('createRoom', data);
});

socket.on(roomname, function(data){
    alert('HELLO: ' + JSON.stringify(data))
});

function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}

function joinedUser(username){
    var el = document.getElementById("joined");
    el.innerHTML += username + 'has joined the room <br/>';
}
