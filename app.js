var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('./lib/sockets').listen(http);
var path = require('path');
var joinParty = require('./routes/join-party');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use('/join-party', joinParty);
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
