var socketio = require('socket.io');
var player = require('./player.js');

module.exports.new_room = function new_room(roomName, io, uniqueCode) {
    this.roomName = roomName;
    this.in_chat = false;
    this.players = {};
    this.io = io;
    this.uniqueCode = "";

    //true,debate_room_id,debate_name,debate_side);
    this.addPlayerToRoom = function(socketId) {
        var new_player = new player.new_player(socketId, this.roomName);
        //Set the socket id so we can select this player by their socket id
        this.players[socketId] = new_player;
    }

    /*********************
           CHAT
    *********************/
    this.chat_message = function chat_message(message, socket) {
        var msg = message.msg;

        //commands
        var command = msg.split(" ");


        if (msg == "/flash") {
            io.sockets.in(this.roomName).emit('flash', msg);
        } else if (msg == "/players") {
            io.sockets.in(this.roomName).emit('players', this.players);
         } else if (command[0].toLowerCase() == "/name") {
            name = command[1];
            this.players[socket.id].setPlayerName(name);
        } else {
            var msg = {
                "message": message.msg,
                "playername": this.players[socket.id].playerName
            };
            io.sockets.in(this.roomName).emit('chat message', msg);
        }

    }



    /*
     DEBUGGING
    */
    this.logtest = function() {
        console.log("test: " + this.roomName);
    }

}
