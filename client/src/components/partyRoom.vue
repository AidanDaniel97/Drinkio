<template>
    <div class="">
      <h1>{{ partyName }}</h1>
      <p>Join code: {{ roomCode }}</p>
       <ul id="messages">
         <li v-for='(message, index) in messages' :key='index'>
            <p>{{ message.playerName }}: {{ message.message }}</p>
          </li>
       </ul>
       <form action="" v-on:submit.prevent="send_message">
         <input autocomplete="off" v-model="chatMessage" id="message" /><button>Send</button>
       </form>
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
      title: 'test title for party room',
      chatMessage: '',
      messages: []
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
      console.log('chat recieved ', message)
      this.messages.push({ playerName: message.playername, message: message.message })
    }
  },
  methods: {
    send_message () {
      var message = this.chatMessage
      console.log(message)
      this.$socket.emit('chat_message', message)
      this.chatMessage = ''
      return false
    }
  }
}
</script>
