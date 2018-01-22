<template>
    <div class="">
      <h1> Party ID: <span id="partyid">XXXX</span> </h1>
       <ul id="messages"></ul>
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
      chatMessage: ''
    }
  },
  sockets: {
    chat_message: function (message) {
      console.log('chat recieved ' , message)
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
