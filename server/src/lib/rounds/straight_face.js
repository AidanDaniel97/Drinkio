// Straight face - you get given a sentence and someone has to complete it and make the reader laugh. / reader picks the best one.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.startRound = function startRound () {
    // start round logic
    console.log('Start ====== ', this.playerList, Array.isArray(this.playerList), ' ========== END ')
    socket.broadcast.to(this.readingPlayer.socket).emit('log_this', 'YOU ARE THE READER')
  }
}
