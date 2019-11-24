/* eslint no-unused-vars: 0 */
//  var socketio = require('socket.io')
var Player = require('./player.js')
var availableRounds = require('./available_rounds')
var straightFace = require('./rounds/straight_face')

module.exports.NewRoom = function NewRoom (roomName, io, partyid, socket) {
  this.roomName = roomName
  this.players = []
  this.playerOrder = []
  this.currentPlayer = null
  this.currentPlayerIndex = null
  this.currentRound = null
  this.io = io
  this.socket = socket
  this.partyid = partyid
  this.playersReady = false
  this.availableRounds = availableRounds
  this.playerMin = 2 // SET THIS BACK TO 2 for the REAL GAME
  this.roomIsLocked = false

  // true,debate_room_id,debate_name,debate_side)
  this.addPlayerToRoom = function (socketId) {
    var newPlayer = new Player.NewPlayer(socketId, this.roomName)
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

    if (this.currentPlayerIndex) {
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
    var randomRound = Math.floor(Math.random() * Object.keys(availableRounds).length)
    this.startNewRound(availableRounds[randomRound])
  }

  this.startNewRound = function startNewRound (round) {
    switch (round.id) {
      // new round - current player whos turn it is, list of players,
      case 1: // Straight Face
        this.currentRound = new straightFace.NewRound(this.currentPlayer, this.players, this)
        break
    }
    // Start the game
    this.broadcastUpdate('choosingRound')

    setTimeout(function () {
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
    // alert all players of new round
    this.broadcastUpdate('roundEnd')
    //  Select the next person to go
    var randomPlayer = Math.floor(Math.random() * Object.keys(this.players).length)
    this.currentPlayer = Object.keys(this.players)[randomPlayer]
    // Select a starting game mode
    var randomRound = Math.floor(Math.random() * Object.keys(availableRounds).length)
    this.startNewRound(availableRounds[randomRound])
  }
}
