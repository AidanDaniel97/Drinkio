module.exports.NewPlayer = function NewPlayer (socket) {
  this.playerName = ''
  this.currentRoomId = null
  this.currentRoomName = null
  this.socket = socket // Direct access to socket
  this.points = 0
  this.playerReady = false

  this.logtest = function () {
    console.log('PLAYER LOG TEST')
  }

  this.setPlayerReady = function (state) {
    this.playerRead = state
  }

  this.setPlayerName = function (playerName) {
    this.playerName = playerName
  }
}
