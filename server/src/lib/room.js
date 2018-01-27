//  var socketio = require('socket.io')
/*eslint-disable */
var Player = require('./player.js')
var events = require('events');
var eventEmitter = new events.EventEmitter();
var availableRounds = require('./available_rounds')

module.exports.NewRoom = function NewRoom (roomName, io, uniqueCode, playerList) {
  this.roomName = roomName
  this.in_chat = false
  this.players = playerList
  this.io = io
  this.uniqueCode = uniqueCode
  this.playersReady = false
  this.availableRounds = availableRounds
  this.playerMin = 1 //SET THIS BACK TO 2 for the REAL GAME
  this.gameLocked = false

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
  Game Logic
  */
  this.sendPlayerReadyCheck = function sendPlayerReadyCheck (socket) {
    console.log('send ready check...')
    socket.emit('ready_check')
  }


  this.checkPlayersReady = function checkPlayersReady () {
    var playersReady = ''
    for (var player in this.players) {
      if (this.players[player].playerReady) {
        console.log('This player is ready')
        playersReady = true
      } else {
        console.log('Player ready: ', this.players[player].playerReady)
        playersReady = false
        return false
      }
    }

    //All players ready and there is more or equal players than the minumum
    if (playersReady){
      if(Object.keys(this.players).length >= this.playerMin){
          eventEmitter.emit('begin_game');
      }else{
        console.log("Players ready, waiting for " + (this.playerMin - Object.keys(this.players).length) +" more players")
      }
    }else{
      console.log('not all players are ready')
    }
  }



  var beginGame = function () {
    this.gameLocked = true
    console.log('Beginning game...');
  }
  eventEmitter.on('begin_game', beginGame);

}
