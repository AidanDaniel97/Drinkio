module.exports.new_player = function player (socketId, currentRoom) {
   this.playerName = "";
   this.currentRoom = currentRoom;
   this.socketId = socketId;
   this.points = 0;

   this.logtest = function(){
     console.log("PLAYER LOG TEST")
   }

   this.setPlayerName = function(playerName){
     this.playerName = playerName;
   }

 }
