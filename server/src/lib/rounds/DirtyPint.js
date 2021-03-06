// Straight face - you get given a sentence and someone has to complete it and make the reader laugh. / reader picks the best one.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, room) {
  this.room = room
  this.round = room.availableRounds.filter(x => x.id === 2)[0]
  this.currentPlayer = playerList[currentPlayerSocket]
  this.playerList = playerList
  this.startRound = function startRound () {
    // update clients with new round
    this.room.broadcastUpdate('startRound', {
      round: this.round,
      playerList: this.playerList,
      currentPlayer: this.currentPlayer
    })
  }
  this.onRoundUpdate = function onRoundUpdate (updateData, socket) {
    // Room update recieved
    console.log('Recieved an update: ', updateData)
  }
  this.roundEnd = function roundEnd () {
    // clear writing response
  }
}
