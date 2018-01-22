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

    // On player joining
    socket.on('join_party', function (partyid) {
      // Check if room exists
      console.log(io.sockets.adapter.rooms[partyid], partyid)
      if (io.sockets.adapter.rooms[partyid]) {
        // This room already exists  - JOIN it

        //* **
        // Add a thing here to check for passwords blah blah blah
        //* ***

        socket.join(partyid)
        // Get the room data
        var roomData = io.sockets.adapter.rooms[partyid].roomData
        // Add this user to the chat's player list
        roomData.addPlayerToRoom(socket.id)
        socket.emit('joined_party')
      } else {
        // Room doesnt exist
        socket.emit('response', {'status': 'error', 'message': error['1000']})
      }
    })

    socket.on('create_party', function (partyname) {
      console.log(io.sockets.adapter.rooms[partyname])

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
      io.sockets.adapter.rooms[partyid].roomData = new Rooms.NewRoom(partyname, io, partyid)
      var roomData = io.sockets.adapter.rooms[partyid].roomData
      roomData.addPlayerToRoom(socket.id)
      // set the player's current room
      playerList[socket.id].currentRoomId = partyid
      console.log('test ', playerList[socket.id])
      playerList[socket.id].currentRoomName = partyname

      console.log('SUCCESS, room created with id ' + partyid)

      socket.emit('created_party')

      // socket.join(partyname)
    })

    socket.on('connected_to_party', function (msg) {
      console.log(playerList[socket.id])
    })

    // Send message to room object
    socket.on('chat_message', function (message) {
      var partyid = playerList[socket.id].currentRoomId
      console.log('Check room: ', roomList[partyid])
      // Pass the room object the message and the socket it was from
      roomList[partyid].roomData.chatMessage(message, socket)
    })
  })

  return io
}