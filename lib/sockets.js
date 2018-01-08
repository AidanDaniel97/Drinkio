var socketio = require('socket.io');
var rooms = require('./room.js');
//Socket list for tracking user's outside of rooms
//Good for remvoing them from games on disconnect
var socketList = {};

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.on('connection', function(socket){
      console.log("New user connected");
      //Add socketid to the list and we can select this player
      //by their socket id - will use this later
      socketList[socket.id] = socket;

      //On player joining
      socket.on('join_party', function(partyid){
        //Check if room exists
        if(io.sockets.adapter.rooms[partyid]){
          //This room already exists  - JOIN it
          socket.join(partyid);
          //Get the room data
          var room_data = io.sockets.adapter.rooms[partyid].room_data;
          //Add this user to the chat's player list
          room_data.addPlayerToRoom(socket.id);
        }else{
          //This room doesn't exist - CREATE it
          socket.join(partyid);
          //Set room up with a data object - pass the room name (party id) and socket io
          io.sockets.adapter.rooms[partyid].room_data = new rooms.new_room(partyid, io);
          var room_data = io.sockets.adapter.rooms[partyid].room_data;
          room_data.addPlayerToRoom(socket.id);
        }


      });

        //Send message to room object
        socket.on('chat message', function(message){
          var partyid = message.partyid;
          //Pass the room object the message and the socket it was from
          io.sockets.adapter.rooms[partyid].room_data.chat_message(message, socket);

        });
    })



    return io
}
