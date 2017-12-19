// Get dependencies
var express = require('express');
var path = require('path');
// Get our API routes
var api = require('./server/routes/api');

var app = express();


var bodyParser = require('body-parser');

/**
 * Create HTTP server.
 */
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
var port = process.env.PORT || '3000';
app.set('port', port);



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));


io.on('connection',function(socket){
    socket.on('test',function(){
        console.log('test received');
    });

    socket.on('createroom',function(){
      console.log('Room created');
      io.emit('roomcreated',"test_room_name");
    })

});
