var roomData;
var roomList = [];

module.exports = {
    setRoomData: function(room){
        roomData = room;
    },

    getRoomData: function(){
        return roomData;
    },

    addRoom: function(room){
        roomList.push(room);
    },

    getRoomList: function(){
        return roomList
    }
}
