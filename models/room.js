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
    },

    getSecondsSinceRoomWasCreated: function(currentRoom){
        var timeInMilliseconds = (new Date() - currentRoom.createdAt) / 1000;
        return parseFloat(timeInMilliseconds).toFixed(0);
    },

    getMeanScore: function(currentRoom){
        if(!currentRoom.totalKeystrokes){
            return 0;
        }
        var meanScore = currentRoom.totalKeystrokes / currentRoom.length;
        return meanScore;
    },

    getUsersRanking: function(currentRoom){
        var rankingList = [];
        var sortedRankingList = [];
        for(var userId in currentRoom.users){
            rankingList.push(currentRoom.users[userId]);
        }
        rankingList.sort(function(currentPlayer, nextPlayer){
            return nextPlayer.score - currentPlayer.score;
        })
        return rankingList;
    },

    getBelowMeanUsers: function(meanScore, currentRoom){
        var totBelowMeanUsers = 0;
        for(var userId in currentRoom.users){
            if(currentRoom.users[userId]['score'] < meanScore){
                totBelowMeanUsers++;
            }
        }

        return totBelowMeanUsers;
    },

    resetRoomCounters: function(currentRoom){
        currentRoom.roundTimeCounter = 0;
        currentRoom.totalKeystrokes = 0;
    }
}
