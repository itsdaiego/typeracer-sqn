module.exports = {
    getRoomActiveUsers: function(room){
        var activeUsers = Object.keys(room.users).length;
        return activeUsers; 
    },

    setTotalKeystrokes: function(currentRoom){
        var totalKeystrokes = 0;
        console.log(JSON.stringify(currentRoom));
        for(var i = 0; i < currentRoom.length; i++){
            totalKeystrokes += room.score;
        } 

        currentRoom.keystrokes = totalKeystrokes;
    }
}
