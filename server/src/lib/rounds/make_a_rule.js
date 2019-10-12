// The selected player gets to make up a rule and the other players have to follow it or drink
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.startRound = function startRound () {
    // Start round logic
  }
}
