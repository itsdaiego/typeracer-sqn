module.exports = {
    getRoomActiveUsers: function(room){
        var activeUsers = Object.keys(room.users).length;
        return activeUsers; 
    },

    setTotalKeystrokes: function(currentRoom){
        var totalKeystrokes = 0;
        for(var userId in currentRoom.users){
            totalKeystrokes += currentRoom.users[userId]['score'];
        }
        currentRoom.totalKeystrokes = totalKeystrokes;
    }
}
