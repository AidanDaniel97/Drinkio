<template>
    <div class="mar-t-80 party-room">
      <h2>Welcome to</h2>
      <h1 v-bind:class="{ flash: flashing }">{{ partyName }}</h1>
      <p>Join code: {{ partyCode }}</p>

      <!-- Could move this into a seperate component -->
       <div v-if="showRoundCard" class="playing-area">
         <div class="round-card">
           <h2>this.currentRound</h2>
         </div>
       </div>

       <modal v-if="showNameModal">
         <h3 slot="header">Enter your name</h3>
         <p slot="body">
           <input v-model="playerName" type="text" placeholder="Name" name="" value="">
         </p>
         <div slot="footer">
           <button class="modal-default-button" v-on:click="sendPlayerReady">
             Continue
           </button>
         </div>
       </modal>
    </div>
</template>

<script>
//  Components
import Modal from './modal'

export default {
  name: 'partyRoom',
  components: {
    'modal': Modal
  },
  data () {
    return {
      chatMessage: '',
      messages: [],
      flashing: false,
      showNameModal: true,
      playerName: '',
      currentRound: ''
    }
  },
  props: {
    // eslint-disable-next-line
    partyName: app.partyName,
    // eslint-disable-next-line
    partyCode: app.partyCode
  },
  sockets: {
    startRound: function (round) {
      console.log(round)
      this.currentRound = round
    },
    roundUpdate: function (packet) {
      console.log('Update message: ', packet)
    },
    chatMessage: function (message) {
      this.messages.push({ playerName: message.playername, message: message.message })
    },
    response: function (error) {
      console.log(error)
    },
    flash: function () {
      this.flashing = true
    },
    players: function (value) {
      console.log(value)
    },
    logThis: function (value) {
      console.log('logged value: ', value)
      //  send back ready
      // this.$socket.emit('playerReady', true)
    }
  },
  methods: {
    sendMessage () {
      var message = this.chatMessage
      console.log(message)
      this.$socket.emit('chatMessage', message)
      this.chatMessage = ''
      return false
    },
    sendPlayerReady () {
      this.showNameModal = false
      this.$socket.emit('playerReady', this.playerName)
    }
  }
}
</script>
