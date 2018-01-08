module.exports.new_player = function player (socketId, currentRoom) {
   this.playerName = "";
   this.currentRoom = currentRoom;
   this.socketId = socketId;

    this.logtest = function(){
     console.log("PLAYER LOG TEST")
   }

 }
