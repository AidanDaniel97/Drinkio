module.exports.NewRound = function NewRound (readingPlayer, writingPlayers, io, socket) {
  this.readingPlayer = readingPlayer
  this.writingPlayers = writingPlayers
  this.socket = socket
  this.startRound = function startRound () {
    console.log('Round starting for straight face!')
    //  First, remove the readingPlayer from the writing players list
    delete writingPlayers[readingPlayer]
    //  First get the current player
    console.log('Reading Player: ', readingPlayer)
    console.log('Writing Players: ', writingPlayers)

    socket.broadcast.to(readingPlayer).emit('log_this', 'YOU ARE THE READER')
  }
}
