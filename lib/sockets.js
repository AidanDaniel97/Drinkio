var socketio = require('socket.io')

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.on('connection', function(socket){
      console.log("New user connected")
        socket.on('chat message', function(msg){
          io.emit('chat message', msg);
        });
    })

    return io
}
