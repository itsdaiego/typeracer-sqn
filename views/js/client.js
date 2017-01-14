var socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');
var users = [];
var currentSentence = "";
var listOfWords = [];
var playerKeyStrokes = 0;
var username;


socket.on('enterRoom', function(roomname){
    console.log("ENTERED ROOM: " + roomname);
});

socket.on('refreshCurrentUsers', function(users){
    clearNewUsers();
    refreshCurrentUsers(users);
});

socket.on('userJoined', function(username){
    clearJoinedUsers();
    pushUsersNotification(username, ' has joined the room <br/>');
});

socket.on('userLeft', function(username, users){
    clearJoinedUsers();
    pushUsersNotification(username, ' has left the room <br/>');
});


socket.on('sentence', function(sentence){
    currentSentence = sentence;
    listOfWords = currentSentence.split(' ');
    pushSentenceToPlayer(sentence);
});

socket.on('startGame', function(){
    startGame();
});


function startGame(){
    listenToKeyStrokes();
}

function checkInputValue(inputValue){
    var currentWord = listOfWords[0];
    var inputValueList = inputValue.split('');
    for(var i=0; i < inputValueList.length; i++){
        if(inputValueList[i] !== currentWord[i]){
            return false;
        }
    }
    return true;
}

function listenToKeyStrokes(){
    var el = document.getElementById("type-listener");
    el.addEventListener('keyup', function(event){
        if(event.keyCode === 32 &&  (this.value.trim() === listOfWords[0]) ){
            listOfWords.shift();
            el.value = '';
            return false;
        }
        var evaluation = checkInputValue(this.value, listOfWords[0]);
        cleanHighlightInput();
        highlightInput(evaluation);
    });
}

function pushSentenceToPlayer(sentence){
    var el = document.getElementById("type-area");
    el.innerHTML += sentence;
}

function highlightInput(evaluation){
    var className = evaluation ? 'correct' : 'incorrect';
    var el = document.getElementById('type-listener');
    if(!el.classList.contains("incorrect")){
        el.className +=  ' ' + className;
    }

}

function cleanHighlightInput(){
    var el = document.getElementById('type-listener').className = "";
}

function refreshCurrentUsers(users){
    for(var properties in users){
        for(var property in users[properties]){
            if(property === 'name'){
                var el = document.getElementById("username");
                el.innerHTML += users[properties][property] + '<br/>';
            }
        }
    }
}

function pushUsersNotification(username, message){
    var el = document.getElementById("joined");
    el.innerHTML += username + message;
}

function clearNewUsers(){
    var el = document.getElementById("username");
    el.innerHTML = "";
}

function clearJoinedUsers(){
    var el = document.getElementById("joined");
    el.innerHTML = '';
}
