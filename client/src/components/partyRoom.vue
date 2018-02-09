<template>
    <div class="">
      <h1 v-on:click="send_player_ready" v-bind:class="{ flash: flashing }">{{ partyName }}</h1>
      <p>Join code: {{ roomCode }}</p>
       <ul id="messages">
         <li v-for='(message, index) in messages' :key='index'>
            <p>{{ message.playerName }}: {{ message.message }}</p>
          </li>
       </ul>
       <form action="" v-on:submit.prevent="send_message">
         <input autocomplete="off" v-model="chatMessage" id="message" /><button>Send</button>
       </form>

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
      playerName: ''
    }
  },
  props: {
    // eslint-disable-next-line
    partyName: app.partyName,
    // eslint-disable-next-line
    roomCode: app.roomCode
  },
  sockets: {
    chat_message: function (message) {
      this.messages.push({ playerName: message.playername, message: message.message })
    },
    flash: function () {
      this.flashing = true
    },
    players: function (value) {
      console.log(value)
    },
    ready_check: function (value) {
      console.log('player ready check')
      //  send back ready
      // this.$socket.emit('player_ready', true)
    },
    log_this: function (value) {
      console.log('logged value: ', value)
      //  send back ready
      // this.$socket.emit('player_ready', true)
    }
  },
  methods: {
    send_message () {
      var message = this.chatMessage
      console.log(message)
      this.$socket.emit('chat_message', message)
      this.chatMessage = ''
      return false
    },
    send_player_ready () {
      this.$socket.emit('player_ready', this.playerName)
    },
    sendPlayerReady () {
      this.showNameModal = false
    }
  }
}
</script>
