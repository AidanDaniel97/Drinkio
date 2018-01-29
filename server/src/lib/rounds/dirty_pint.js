module.exports.NewRound = function NewRound (readingPlayer) {
  this.readingPlayer = readingPlayer
  this.startRound = function startRound () {
    console.log('Round starting for dirty pint!')
  }
}
