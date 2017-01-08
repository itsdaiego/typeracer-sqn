var roomData;

module.exports = {
    setRoomData: function(room){
        roomData = room;
    },

    getRoomData: function(){
        return roomData;
    }
}
