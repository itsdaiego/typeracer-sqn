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
        currentRoom.currentWinner = 0;
        currentRoom.gameDuration = 5;
        currentRoom.users[socket] = this.setNewUser(socket.username);
    },
    increasePlayerScore: function(socket, currentRoom, scoreData){
        socket.score++;

        currentRoom.currentWinner = scoreData.score > currentRoom.currentWinner ? scoreData : currentRoom.currentWinner;

    }
}
