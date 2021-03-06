var socketio = require('socket.io')
var Rooms = require('./room.js')
var codegen = require('./codegen.js')
var Player = require('./player.js')
var error = require('./error_messages.json')

// Socket list for tracking user's outside of rooms
// Good for remvoing them from games on disconnect
var playerList = {}
var roomList = {}

module.exports.listen = function (app) {
  var io = socketio.listen(app)

  io.on('connection', function (socket) {
    console.log('New user connected')
    // On every connection, reinitiate the newPlayer class for that socket
    // This will prevent any points/stats carrying over to another game
    var newPlayer = new Player.NewPlayer(socket)
    socket.player = newPlayer
    playerList[socket.id] = socket

    // On player disconnect - remove them from the player list
    socket.on('disconnect', function () {
      //  if the player is in a room, remove them from the room
      // console.log('disconnect: ', socket.id, socket)
      if (playerList[socket.id] && playerList[socket.id].currentRoomId) {
        roomList[playerList[socket.id].currentRoomId].roomData.removePlayerFromRoom(socket)
      }
      // Remove them from the main player list
      delete playerList[socket.id]
      // console.log(playerList[socket.id])
    })

    // On player joining
    socket.on('join_party', function (partyid) {
      // Check if room exists
      // console.log(io.sockets.adapter.rooms[partyid], partyid)
      if (io.sockets.adapter.rooms[partyid]) {
        // This room already exists  - JOIN it
        //* **
        // Add a thing here to check for passwords blah blah blah
        //* ***
        if (io.sockets.adapter.rooms[partyid].roomData.roomIsLocked) {
          console.log('this room is locked')
          //  room is locked - game is in progress
          socket.emit('response', {'status': 'error', 'message': error['2']})
        } else {
          socket.join(partyid)
          // Get the room data
          var roomData = io.sockets.adapter.rooms[partyid].roomData
          // Add this user to the room's player list
          roomData.addPlayerToRoom(socket.id)

          //  set the user's current room
          playerList[socket.id].currentRoomId = partyid
          playerList[socket.id].currentRoomName = roomData.roomName

          // set the player's current room
          socket.emit('joinedParty', {
            'partyName': roomData.roomName,
            'partyCode': playerList[socket.id].currentRoomId,
            'socketID': socket.id
          })
          //  Check if everyone is now ready
          roomData.checkPlayersReady(socket)
        }
      } else {
        // Room doesnt exist
        socket.emit('response', {'status': 'error', 'message': error['1']})
      }
    })

    socket.on('create_party', function (partyData) {
      var partyName = partyData[0]
      var gameMode = partyData[1]
      // Generate unique room code
      var partyid = codegen.generateCode(5, 'aA')
      // Join the room using a unique code
      socket.join(partyid)
      // Set that unique code to the room object and keep in the rooms array
      roomList[partyid] = io.sockets.adapter.rooms[partyid]

      //* **********************
      // ADD SOMETHING HERE TO CHECK IF THAT ROOM ALREADY EXISTS
      // if(!roomList[partyid]){
      //* **********************
      // Set room up with a data object - pass the room name (party id) and socket
      io.sockets.adapter.rooms[partyid].roomData = new Rooms.NewRoom(partyName, gameMode, io, partyid, socket)
      var roomData = io.sockets.adapter.rooms[partyid].roomData
      roomData.addPlayerToRoom(socket.id)
      // set the player's current room
      playerList[socket.id].currentRoomId = partyid
      playerList[socket.id].currentRoomName = partyName

      socket.emit('createdParty', {
        'partyName': roomData.roomName,
        'partyCode': playerList[socket.id].currentRoomId,
        'socketID': socket.id
      })
    })

    // Send message to room object
    socket.on('roundUpdate', function (updateData) {
      var partyid = playerList[socket.id].currentRoomId
      console.log('Party ID: ', partyid)
      // Pass the room object the message and the socket it was from
      roomList[partyid].roomData.onRoundUpdate(updateData, socket)
    })

    socket.on('endRound', function () {
      var partyid = playerList[socket.id].currentRoomId
      // Pass the room object the message and the socket it was from
      roomList[partyid].roomData.onRoundEnd(socket)
    })

    //  A player in a room has said they are ready
    socket.on('playerReady', function () {
      var partyid = playerList[socket.id].currentRoomId
      roomList[partyid].roomData.setPlayerReady(socket)
    })

    // A player in a room has sent their name
    socket.on('playerName', function (playerName) {
      socket.emit('playerUpdate', {
        'playerName': playerName
      })
      var partyid = playerList[socket.id].currentRoomId
      roomList[partyid].roomData.setPlayerName(socket, playerName)
    })
  })
  return io
}
