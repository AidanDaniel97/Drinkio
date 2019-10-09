//  var socketio = require('socket.io')
/*eslint-disable */
var Player = require('./player.js')
var availableRounds = require('./available_rounds')
var straightFace = require('./rounds/straight_face')
var dirtyPint = require('./rounds/dirty_pint')

module.exports.NewRoom = function NewRoom (roomName, io, uniqueCode, socket) {
  this.roomName = roomName
  this.in_chat = false
  this.players = []
  this.currentPlayer = null
  this.currentRound = null
  this.io = io
  this.socket = socket
  this.uniqueCode = uniqueCode
  this.playersReady = false
  this.availableRounds = availableRounds
  this.playerMin = 2 //SET THIS BACK TO 2 for the REAL GAME
  this.roomLocked = false

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.roomName)
    // Set the socket id so we can select this player by their socket id
    console.log(' =======' ,this.players)
    this.players[socketId] = newPlayer 
    console.log(' =======' ,this.players)
  }

  /** *******************
           CHAT
    *********************/
  this.chatMessage = function chatMessage (msg, socket) {
    // commands
    var command = msg.split(' ')
    console.log(msg)

    if (msg === '/flash') {
      this.io.in(this.uniqueCode).emit('flash', msg)
    } else if (msg === '/players') {
      console.log(this.players)
       this.io.in(this.uniqueCode).emit('players', this.players)
     } else if (command[0].toLowerCase() === '/name') {
       var name = command[1]
       this.players[socket.id].setPlayerName(name)
     } else {
      var message = {
        'message': msg,
        'playername': this.players[socket.id].playerName
      }
      this.io.in(this.uniqueCode).emit('chat_message', message)
    }
  }

  /*
  Room Logic
  */
  this.sendPlayerReadyCheck = function sendPlayerReadyCheck (socket) {
    console.log('send ready check...')
    socket.emit('ready_check')
  }

  this.playerDisconnect = function playerDisconnect (socket) {
    delete this.players[socket.id]
  }

  this.setPlayerReady = function (socket, playerName) {
    console.log('Recieved player ready!!!')
    //  Set the player to ready
    this.players[socket.id].playerReady = true
    console.log('player name: ', playerName)
    this.players[socket.id].playerName = playerName
    console.log('Set player name ', this.players[socket.id])
    //  Check if all players in the room are ready
    this.checkPlayersReady()
  }

  this.checkPlayersReady = function checkPlayersReady () {
    var playersReady = ''
    for (var player in this.players) {
      if (this.players[player].playerReady) {
        // console.log('This player is ready')
        playersReady = true
      } else {
        // console.log('Player is not ready: ', this.players[player].playerReady)
        playersReady = false
        return false
      }
    }

    //All players ready and there is more or equal players than the minumum
    if (playersReady){
      if(Object.keys(this.players).length >= this.playerMin){
          this.beginGame()
      }else{
        console.log('Players ready, waiting for ' + (this.playerMin - Object.keys(this.players).length) +' more players to join and be ready')
      }
    }else{
      console.log('not all players are ready')
    }
  }


  this.startRound = function startRound(round){
    // //If there is not a current player for this round
    // if (!this.currentPlayer){
    //   this.currentPlayer = Object.keys(this.players)[0]
    //   console.log(this.currentPlayer)
    // }
    switch (round) {
        case 'dirty_pint':
            console.log('Dirty pint!');
            this.io.in(this.uniqueCode).emit('round_start', 'Dirty Pint')
            this.currentRound = new dirtyPint.NewRound(this.currentPlayer)
            this.currentRound.startRound()
            break;
        case 'straight_face':
            console.log('Straight Face!');
            this.io.in(this.uniqueCode).emit('round_start', 'Straight Face!')
            console.log(this.currentPlayer)
            this.currentRound = new straightFace.NewRound(this.currentPlayer, this.players, this.io, this.socket)
            this.currentRound.startRound()
            break;
    }
  }


  this.beginGame = function beginGame () {
    this.roomLocked = true
    console.log('Beginning game...');
    //  Select the first person to go
    var randomPlayer = Math.floor(Math.random() * Object.keys(this.players).length);
    // console.log('Random player: ', this.players[randomPlayer], this.players)
    this.io.emit('log_this', this.players)
    this.currentPlayer = Object.keys(this.players)[randomPlayer]
    //Select a starting game mode
    var randomRound = Math.floor(Math.random() * Object.keys(availableRounds).length);
    this.startRound(availableRounds[randomRound])
  }


}
