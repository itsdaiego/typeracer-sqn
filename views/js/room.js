var socket;


var socket = io.connect('http://localhost:3000');


socket.on('welcome', function(data){
    console.log(data);
    pushUserName(data.content.username);
});

function pushUserName(username){
    var el = document.getElementById("username");
    el.innerHTML += username + '<br/>';
}
