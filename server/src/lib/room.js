/* eslint no-unused-vars: 0 */
//  var socketio = require('socket.io')
var Player = require('./player.js')
var availableRounds = require('./available_rounds')
var straightFace = require('./rounds/straight_face')

module.exports.NewRoom = function NewRoom (roomName, io, partyid, socket) {
  this.roomName = roomName
  this.players = []
  this.currentPlayer = null
  this.currentRound = null
  this.io = io
  this.socket = socket
  this.partyid = partyid
  this.playersReady = false
  this.availableRounds = availableRounds
  this.playerMin = 1 // SET THIS BACK TO 2 for the REAL GAME
  this.roomLocked = false

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.roomName)
    // Set the socket id so we can select this player by their socket id
    this.players.push(newPlayer)
    // console.log(this.players)
  }

  // Get the player object from the socket
  this.getPlayer = function getPlayer (socket) {
    return this.players.filter(player => player.socket === socket.id)[0]
  }

  this.playerDisconnect = function playerDisconnect (socket) {
    this.players = this.players.filter(player => player.socket !== socket)
  }

  /*  Send player ready checks  */
  this.sendPlayerReadyCheck = function sendPlayerReadyCheck (socket) {
    console.log('send ready check...')
    socket.emit('ready_check')
  }

  this.setPlayerReady = function (socket, playerName) {
    var thisPlayer = this.getPlayer(socket)
    thisPlayer.setPlayerName(playerName)
    //  Set the player to ready
    thisPlayer.playerReady = true
    //  Check if all players in the room are ready
    this.checkPlayersReady()
  }

  this.checkPlayersReady = function checkPlayersReady () {
    // All players ready and there is more or equal players than the minumum
    if (this.players.filter(player => player.playerReady).length === this.players.length) {
      if (Object.keys(this.players).length >= this.playerMin) { // all players are ready and meet the min players
        this.beginGame()
      } else {
        console.log('Players ready, waiting for ' + (this.playerMin - Object.keys(this.players).length) + ' more players to join and be ready')
      }
    } else {
      console.log('not all players are ready')
    }
  }

  this.startRound = function startRound (round) {
    switch (round.id) {
      // new round - current player whos turn it is, list of players,
      case 1: // Straight Face
        this.currentRound = new straightFace.NewRound(this.currentPlayer, this.players, this)
        break
    }
    // Start the game
    this.currentRound.startRound()
  }

  this.beginGame = function beginGame () {
    this.roomLocked = true
    //  Select the first person to go
    var randomPlayer = Math.floor(Math.random() * Object.keys(this.players).length)
    this.currentPlayer = Object.keys(this.players)[randomPlayer]
    // Select a starting game mode
    var randomRound = Math.floor(Math.random() * Object.keys(availableRounds).length)
    this.startRound(availableRounds[randomRound])
  }

  // Send update to room from round
  this.broadcastUpdate = function broadcastUpdate (update, packet) {
    this.io.in(this.partyid).emit(update, packet)
  }

  // On update recieved
  this.onRoundUpdate = function onRoundUpdate (updateData, socket) {
    this.currentRound.onRoundUpdate(updateData, socket)
  }
}
