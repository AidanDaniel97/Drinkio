var socketio = require('socket.io')

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.on('connection', function(socket){
      console.log("New user connected")

      socket.on('join_party', function(partyid){
        console.log("User:  " , socket.rooms);

        if(io.sockets.adapter.rooms[partyid]){
          //This room doesn't exist - so we are creating it
          socket.join(partyid);
        }else{
          //This room already exists so we are joining it
          socket.join(partyid);
        }


      });

        //
        socket.on('chat message', function(message){

          var msg = message.msg;
          var partyid = message.partyid;

          if (msg == "/flash"){
            console.log("FLASHHH")
            io.sockets.in(partyid).emit('flash', msg);
          }

          console.log("Message: " , msg , " party id: " , partyid);
          // io.emit('chat message', msg);
          io.sockets.in(partyid).emit('chat message', msg);
        });
    })



    return io
}
