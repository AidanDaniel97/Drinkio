module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, io, socket) {
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = []
  this.currentPlayerSocket = currentPlayerSocket
  this.playerList = playerList
  this.socket = socket
  this.startRound = function startRound () {

    // playerList.filter(x => x.player.socket == currentPlayerSocket);
    // playerList.filter(x => x.player.socket != currentPlayerSocket);
    // this.readingPlayer = this.playerList[currentPlayerSocket]
    // this.writingPlayers = this.playerList.filter(x => x != currentPlayerSocket);
    // console.log(this , '======' , this.readingPlayer)
    console.log('===== ', this.playerList[0])
    // this.playerList.filter(function(player) {
    //   console.log('====', player)
    // });
    // console.log('Round starting for straight face!')
    // //  First, remove the readingPlayer from the writing players list
    // // this.writingPlayers =
    // //  First get the current player
    // console.log('Reading Player: ', readingPlayer)
    // console.log('Writing Players: ', writingPlayers)
    //
    socket.broadcast.to(this.readingPlayer.socket).emit('log_this', 'YOU ARE THE READER')
  }
}
