//  var socketio = require('socket.io')
var Player = require('./player.js')

module.exports.NewRoom = function NewRoom (roomName, io, uniqueCode) {
  this.roomName = roomName
  this.in_chat = false
  this.players = {}
  this.io = io
  this.uniqueCode = uniqueCode

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.roomName)
    // Set the socket id so we can select this player by their socket id
    this.players[socketId] = newPlayer
  }

  /** *******************
           CHAT
    *********************/
  this.chatMessage = function chatMessage (msg, socket) {
    console.log('Recieved msgeee ', msg, this.uniqueCode)

    // commands
    var command = msg.split(' ')

    if (msg === '/flash') {
      io.in(this.uniqueCode).emit('flash', msg)
    } else if (msg === '/players') {
      io.in(this.uniqueCode).emit('players', this.players)
    } else if (command[0].toLowerCase() === '/name') {
      var name = command[1]
      this.players[socket.id].setPlayerName(name)
    } else {
      var message = {
        'message': msg,
        'playername': this.players[socket.id].playerName
      }
      io.in(this.uniqueCode).emit('chat_message', message)
    }
  }

  /*
     DEBUGGING
    */
  this.logtest = function () {
    console.log('test: ' + this.roomName)
  }
}
