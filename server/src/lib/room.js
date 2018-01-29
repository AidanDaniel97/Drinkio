//  var socketio = require('socket.io')
/*eslint-disable */
var Player = require('./player.js')
var availableRounds = require('./available_rounds')
var straightFace = require('./rounds/straight_face')
var dirtyPint = require('./rounds/dirty_pint')

module.exports.NewRoom = function NewRoom (roomName, io, uniqueCode, playerList) {
  this.roomName = roomName
  this.in_chat = false
  this.players = playerList
  this.currentPlayer = null
  this.currentRound = null
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
  Room Logic
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
        console.log('Player is not ready: ', this.players[player].playerReady, this.players[player])
        playersReady = false
        return false
      }
    }

    //All players ready and there is more or equal players than the minumum
    if (playersReady){
      if(Object.keys(this.players).length >= this.playerMin){
          this.beginGame()
      }else{
        console.log("Players ready, waiting for " + (this.playerMin - Object.keys(this.players).length) +" more players")
      }
    }else{
      console.log('not all players are ready')
    }
  }


  this.startRound = function startRound(round){
    // if (!this.currentPlayer){
    //   this.currentPlayer = this.players[0]
    //   console.log(this.currentPlayer)
    // }
    switch (round) {
        case 'dirty_pint':
            console.log('Dirty pint!');
            this.currentRound = new dirtyPint.NewRound()
            this.currentRound.startRound()
            break;
        case 'straight_face':
            console.log('Straight Face!');
            this.currentRound = new straightFace.NewRound()
            this.currentRound.startRound()
            break;
    }
  }


  this.beginGame = function beginGame () {
    this.gameLocked = true
    console.log('Beginning game...');
    //  Select the first person to go
    var randomPlayer = Math.floor(Math.random() * Object.keys(this.players).length);
    console.log('Random player: ', this.players[randomPlayer])
    //Select a starting game mode
    var randomRound = Math.floor(Math.random() * Object.keys(availableRounds).length);
    this.startRound(availableRounds[randomRound])
  }


}
