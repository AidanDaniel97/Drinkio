module.exports.NewPlayer = function NewPlayer (socket) {
  this.playerName = ''
  this.currentRoomId = null
  this.currentRoomName = null
  this.socket = socket // Direct access to socket
  this.points = 0

  this.logtest = function () {
    console.log('PLAYER LOG TEST')
  }

  this.setPlayerName = function (playerName) {
    this.playerName = playerName
  }
}
