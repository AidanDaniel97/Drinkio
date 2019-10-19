// Straight face - you get given a sentence and someone has to complete it and make the reader laugh. / reader picks the best one.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io, room) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.roundName = 'Straight Face'
  this.writingPlayers = playerList.filter(x => x.socket != this.readingPlayer.socket)[0]
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.room = room
  this.startRound = function startRound () {
    // update clients with new round
    this.room.broadcastUpdate('startRound', {
      roundName: this.roundName,
      readingPlayer: this.readingPlayer,
      writingPlayers: this.writingPlayers
    })
    //
  }
}
