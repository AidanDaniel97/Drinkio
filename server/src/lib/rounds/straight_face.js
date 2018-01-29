module.exports.NewRound = function NewRound (readingPlayer, writingPlayers) {
  this.readingPlayer = readingPlayer
  this.otherPlayers = writingPlayers
  this.startRound = function startRound () {
    console.log('Round starting for straight face!')
  }
}
