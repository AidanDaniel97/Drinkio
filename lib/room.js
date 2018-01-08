var socketio = require('socket.io');
var player = require('./player.js');

module.exports.new_room = function new_room (roomName, io) {
   this.roomName = roomName;
   this.in_chat = false;
   this.players = [];
   this.io = io;

   //true,debate_room_id,debate_name,debate_side);
   this.addPlayerToRoom = function(socketId){
     var new_player = new player.new_player(socketId, this.roomName);
     this.players.push(new_player);




   }

   /*
      CHAT
   */
   this.chat_message = function chat_message(message){
     var msg = message.msg;

     if (msg == "/flash"){
       io.sockets.in(this.roomName).emit('flash', msg);
     }

     io.sockets.in(this.roomName).emit('chat message', msg);
   }




   /*
    DEBUGGING
   */
   this.logtest = function(){
     console.log("test: " + this.roomName);
   }

 }


//Send players list
