var availableRounds = require('../available_rounds')
// Straight face - you get given a sentence and someone has to complete it and make the reader laugh. / reader picks the best one.
module.exports.NewRound = function NewRound (currentPlayerSocket, playerList, room) {
  this.room = room
  this.round = availableRounds.filter(x => x.id === 1)[0]
  this.readingPlayer = playerList[currentPlayerSocket]
  this.writingPlayers = playerList.filter(x => x.socket !== this.readingPlayer.socket)
  this.playerList = playerList
  this.startRound = function startRound () {
    // update clients with new round
    this.room.broadcastUpdate('startRound', {
      round: this.round,
      readingPlayer: this.readingPlayer,
      writingPlayers: this.writingPlayers,
      playerList: this.playerList
    })
  }
  this.onRoundUpdate = function onRoundUpdate (updateData, socket) {
    // Room update recieved
    console.log('Recieved an update: ', updateData)
    switch (updateData.update) {
      case 'readingResponse':
        this.handleReadingResponse(updateData.data, socket)
    }
  }
  this.handleReadingResponse = function handleReadingResponse (readingResponse, socket) {
    // set this players reading response
    this.writingPlayers.filter(x => x.socket === socket.id)[0].readingResponse = readingResponse
    // check if all responses have been made
    if(this.checkReadingResponses()){
      // equals true so now trigger reading reader to see all responses
    }
  }
  this.checkReadingResponses = function checkReadingResponses () {
    return this.writingPlayers.filter(x => x.readingResponse !== '' && x.readingResponse !== '').length === this.writingPlayers.length
  }
}
