// Dirty pint - a player must add their drink to the group's cup.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.startRound = function startRound () {
    // Start round logic
  }
}
