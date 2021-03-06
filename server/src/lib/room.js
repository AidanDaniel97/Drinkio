/* eslint no-unused-vars: 0 */
/* eslint no-eval: 0 */
//  var socketio = require('socket.io')
var Player = require('./player.js')
var availableRounds = require('./availableRounds')
var straightFace = require('./rounds/StraightFace')
var dirtyPint = require('./rounds/DirtyPint')

module.exports.NewRoom = function NewRoom (partyName, gameMode, io, partyid, socket) {
  this.partyName = partyName
  this.players = []
  this.playerOrder = []
  this.currentPlayer = null
  this.currentPlayerIndex = null
  this.currentRound = null
  this.io = io
  this.socket = socket
  this.partyid = partyid
  this.playersReady = false
  this.availableRounds = availableRounds[gameMode]
  this.playerMin = 1 // SET THIS BACK TO 2 for the REAL GAME
  this.roomIsLocked = false

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.partyName)
    // Set the socket id so we can select this player by their socket id
    this.players.push(newPlayer)
  }

  this.removePlayerFromRoom = function removePlayerFromRoom (socket) {
    this.players = this.players.filter(player => player.socket !== socket)
  }

  // Get the player object from the socket
  this.getPlayer = function getPlayer (socket) {
    return this.players.filter(player => player.socket === socket.id)[0]
  }

  this.setPlayerReady = function (socket) {
    var thisPlayer = this.getPlayer(socket)
    //  Set the player to ready
    thisPlayer.setPlayerReady(true)
    //  Check if all players in the room are ready
    this.checkPlayersReady()
  }

  this.setPlayerName = function (socket, playerName) {
    var thisPlayer = this.getPlayer(socket)
    //  Set the player to ready
    thisPlayer.setPlayerName(playerName)
  }

  this.checkPlayersReady = function checkPlayersReady () {
    // All players ready and there is more or equal players than the minumum
    if (this.players.length >= this.playerMin) {
      if (this.players.filter(player => player.playerReady).length === this.players.length) { // all players are ready and meet the min players
        // choose first player
        this.choosePlayer()
      } else {
        this.broadcastUpdate('waitingForPlayersReady')
      }
    } else {
      this.broadcastUpdate('waitingForMorePlayers', {
        playersLeft: this.playerMin - Object.keys(this.players).length
      })
    }
  }

  this.choosePlayer = function choosePlayer () {
    this.roomIsLocked = true

    if (this.currentPlayerIndex != null) {
      var nextPlayer = Object.keys(this.players)[this.currentPlayerIndex + 1]
      if (nextPlayer) {
        console.log('Next player...', nextPlayer)
        // this player exists in the player array
        this.currentPlayer = nextPlayer
      } else { // reset back to first player
        console.log('Reset...', nextPlayer)
        this.currentPlayer = Object.keys(this.players)[0]
        this.currentPlayerIndex = 0
      }
      this.currentPlayerIndex += 1
    } else {
      console.log('No current player index...', Object.keys(this.players)[0])
      this.currentPlayer = Object.keys(this.players)[0]
      this.currentPlayerIndex = 0
    }

    // Select a starting game mode
    console.log(this.availableRounds)
    var randomRound = Math.floor(Math.random() * Object.keys(this.availableRounds).length)
    this.startNewRound(this.availableRounds[randomRound])
  }

  this.startNewRound = function startNewRound (round) {
    switch (round.id) {
      // new round - current player whos turn it is, list of players,
      case 1: // Straight Face
        this.currentRound = new straightFace.NewRound(this.currentPlayer, this.players, this)
        break
      case 2: // Dirty Pint
        this.currentRound = new dirtyPint.NewRound(this.currentPlayer, this.players, this)
    }
    // Start the game
    this.broadcastUpdate('choosingRound')

    setTimeout(function () {
      console.log('Starting new round, ', round.id)
      this.currentRound.startRound()
    }.bind(this), 2000)
  }

  // Send update to single socket in room
  this.sendSingleUpdate = function sendSingleUpdate (update, packet, socket) {
    this.io.to(socket).emit(update, packet)
  }

  // Send update to room from round
  this.broadcastUpdate = function broadcastUpdate (update, packet) {
    this.io.in(this.partyid).emit(update, packet)
  }

  // On update recieved
  this.onRoundUpdate = function onRoundUpdate (updateData, socket) {
    this.currentRound.onRoundUpdate(updateData, socket)
  }

  // On round end, start a new round
  this.onRoundEnd = function onRoundEnd () {
    // Send end round to game, to reset any values
    this.currentRound.roundEnd()
    // alert all players of new round
    this.broadcastUpdate('roundEnd')
    //  Select the next person to go
    this.choosePlayer()
    // Select a starting game mode
    var randomRound = Math.floor(Math.random() * Object.keys(this.availableRounds).length)
    this.startNewRound(this.availableRounds[randomRound])
  }
}
