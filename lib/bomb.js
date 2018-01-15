var socketio = require('socket.io');
var player = require('./player.js');

module.exports.bomb = function bomb(roomName, io) {
    this.time = roomName;



    this.countdown = function countdown() {
        var i = document.getElementById('counter');
        i.innerHTML = parseInt(i.innerHTML)-1;
        if (parseInt(i.innerHTML)==0) {
           console.log("Timer done BOOOMB")
        }
    }


    this.startTimer = function startTimer(){
      var timerId = setInterval(function(){ this.countdown(); },5000);
    }

}
