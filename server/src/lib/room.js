//  var socketio = require('socket.io')
var Player = require('./player.js')

module.exports.NewRoom = function NewRoom (roomName, io, uniqueCode) {
  this.roomName = roomName
  this.in_chat = false
  this.players = {}
  this.io = io
  this.uniqueCode = ''

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.roomName)
    // Set the socket id so we can select this player by their socket id
    this.players[socketId] = newPlayer
  }

  /** *******************
           CHAT
    *********************/
  this.chatMessage = function chatMessage (message, socket) {
    console.log('Recieved message ', message)

    // commands
    var command = message.split(' ')

    if (message === '/flash') {
      io.sockets.in(this.uniqueCode).emit('flash', message)
    } else if (message === '/players') {
      io.sockets.in(this.uniqueCode).emit('players', this.players)
    } else if (command[0].toLowerCase() === '/name') {
      var name = command[1]
      this.players[socket.id].setPlayerName(name)
    } else {
      message = {
        'message': message.message,
        'playername': this.players[socket.id].playerName
      }
      io.sockets.in(this.uniqueCode).emit('chat_message', message)
    }
  }

  /*
     DEBUGGING
    */
  this.logtest = function () {
    console.log('test: ' + this.roomName)
  }
}
