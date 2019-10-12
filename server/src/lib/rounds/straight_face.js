module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io, socket) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.socket = socket
  this.startRound = function startRound () {

    console.log('Start ====== ' ,this.playerList, Array.isArray(this.playerList), ' ========== END ')

    socket.broadcast.to(this.readingPlayer.socket).emit('log_this', 'YOU ARE THE READER')
  }
}
