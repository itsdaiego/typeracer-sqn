var highestScore = {
    score: 0
};
module.exports = {
    setCurrentWinner: function(scoreData){
        if(scoreData.score > highestScore.score){
            highestScore = scoreData;
            console.log("new: " + JSON.stringify(highestScore));
        }
    },
    getCurrentWinner: function(){
        return highestScore
    }
}
