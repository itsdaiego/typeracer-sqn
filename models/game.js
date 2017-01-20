module.exports = {
    setNewUser: function(username){
        var user = {
            name: username,
            score: 0
        };
        return user;
    },

    setConnectionProperties: function(socket, currentRoom, roomData){
        socket.username = roomData.username;
        socket.room = roomData.roomname;
        socket.sentenceCounter = 0;
        socket.score = 0;

    },

    setCurrentRoomProperties: function(currentRoom, socket){
        if(!currentRoom.users){
            currentRoom.users = {};
        }
        currentRoom.usersReady = 0;
        currentRoom.currentWinner = {score: 0};
        currentRoom.finalWinner = {score: 0};
        currentRoom.roundTime = 60;
        currentRoom.gameDuration = 20;
        currentRoom.createdAt = new Date();
        currentRoom.roundTimeCounter = 0;
        currentRoom.users[socket.id] = this.setNewUser(socket.username);
    },

    setCurrentWinner: function(currentRoom, socket){
        var scoreData = {
            score: socket.score,
            username: socket.username
        }
        currentRoom.currentWinner = scoreData.score > currentRoom.currentWinner.score ? scoreData : currentRoom.currentWinner;
    },

    setFinalWinner: function(currentRoom, socket){
        var scoreData = {
            score: socket.score,
            username: socket.username
        }
        currentRoom.finalWinner = scoreData.score > currentRoom.finalWinner.score ? scoreData : currentRoom.finalWinner;
    }

}
