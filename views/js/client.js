var socket, roomname, ioRoom;
var socket = io.connect('http://localhost:3000');
var users = [];
var currentSentence = "";
var listOfWords = [];
var username;


socket.on('userInfo', function(data){
    username = data.username;
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


socket.on('newSentence', function(sentence){
    currentSentence = sentence;
    listOfWords = currentSentence.split(' ');
    pushSentenceToPlayer(sentence);
});

socket.on('startGame', function(){
    startGame();
    showTimer();
    hideStartButton();
});

socket.on('updateScore', function(scoreData){
    updateScore(scoreData);
});

socket.on('timeRemaining', function(gameDuration){
    showTimer(gameDuration);
});

socket.on('gameFinished', function(winner){
    alert(username +  ' is the winner');
});

function startGame(){
    var el = document.getElementById("type-listener");
    el.addEventListener('keyup', function(event){
        if(event.keyCode === 32 &&  (this.value.trim() === listOfWords[0]) ){
            updateSentence();
            el.value = '';
            return false;
        }
        var evaluation = checkInputValue(this.value, listOfWords[0]);
        cleanHighlightInput();
        highlightInput(evaluation);
        if(evaluation  && event.keyCode !== 8){
            socket.emit('sendPlayerScore', username);
        }
    });
}

function updateSentence(){
    listOfWords.shift();
    if(listOfWords.length === 0){
        socket.emit('sentenceFinished')
    }
    else{
        var newSentence = listOfWords.join().replace(/,/g, ' ');
        pushSentenceToPlayer(newSentence); 
    }
}

function updateScore(scoreData){
    var el = document.getElementById(scoreData.username);
    el.innerHTML = scoreData.username + " " + scoreData.score;
}

function checkInputValue(inputValue){
    var currentWord = listOfWords[0];
    var inputValueList = inputValue.split('');
    if(inputValueList.length > 0){
        for(var i=0; i < inputValueList.length; i++){
            if(inputValueList[i] !== currentWord[i]){
                return false;
            }
        }
        return true;
    }
    else{
        return false;
    }
}

function pushSentenceToPlayer(sentence){
    var el = document.getElementById("type-area");
    el.innerHTML = sentence;
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
                var el = document.getElementById('username');
                el.innerHTML += "<p id='"+users[properties][property]+"'>" + users[properties][property] + '<p>';
            }
        }
    }
}

function pushUsersNotification(username, message){
    var el = document.getElementById("joined");
    el.innerHTML += username + message;
}

function clearNewUsers(){
    var el = document.getElementById('username');
    el.innerHTML = "";
}

function clearJoinedUsers(){
    var el = document.getElementById("joined");
    el.innerHTML = '';
}

function userReady(){
    var el = document.getElementById("start-button");
    el.innerHTML = 'Waiting for other players...';
    socket.emit('userReady');
}

function showTimer(gameDuration){
    var el = document.getElementById('time-remaining');
    el.innerHTML = "Time remaining: " + gameDuration + " seconds";
}

function hideStartButton(){
    var el = document.getElementById('start-button');
    el.style.display = 'none';
}
