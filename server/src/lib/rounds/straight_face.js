var availableRounds = require('../available_rounds')
// Straight face - you get given a sentence and someone has to complete it and make the reader laugh. / reader picks the best one.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, room) {
  this.room = room
  this.round = availableRounds.filter(x => x.id === 1)[0]
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = playerList.filter(x => x.socket !== this.readingPlayer.socket)[0]
  this.playerList = playerList
  this.startRound = function startRound () {
    // update clients with new round
    this.room.broadcastUpdate('startRound', {
      round: this.round,
      readingPlayer: this.readingPlayer,
      writingPlayers: this.writingPlayers,
      playerList: this.playerList
    })
  }
  this.onRoundUpdate = function onRoundUpdate (updateData, socket) {
    // Room update recieved
    console.log('Recieved an update: ', updateData)
  }
}
