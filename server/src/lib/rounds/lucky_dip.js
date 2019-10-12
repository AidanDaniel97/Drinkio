// Player must choose if they accept the lucky dip or not, there is a chance of getting to dish out a sip of drink, or to have to take two sips
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.startRound = function startRound () {
    // Start round logic
  }
}
