var availableRounds = require('../availableRounds')
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
      case 'writerResponse':
        this.handleWriterResponses(updateData.data, socket)
        break

      case 'writerResponseChosen':
        this.room.broadcastUpdate('writingResponseChosen', updateData.data)
        break
    }
  }
  this.handleWriterResponses = function handleWriterResponses (writerResponse, socket) {
    // set this players reading response
    this.writingPlayers.filter(x => x.socket === socket.id)[0].writerResponse = writerResponse
    // check if all responses have been made
    if (this.checkWriterResponses()) {
      var responses = []
      for (var player in this.writingPlayers) {
        responses.push({
          playerName: this.writingPlayers[player].playerName,
          socket: this.writingPlayers[player].socket,
          writerResponse: this.writingPlayers[player].writerResponse
        })
      }
      this.room.broadcastUpdate('writerResponses', responses)
    }
  }
  this.checkWriterResponses = function checkWriterResponses () {
    return this.writingPlayers.filter(x => x.writerResponse && x.writerResponse != '').length === this.writingPlayers.length
  }
  this.roundEnd = function roundEnd () {
    // clear writing responses
    this.writingPlayers.forEach((player) => {
      player.writerResponse = ''
    })
  }
}
