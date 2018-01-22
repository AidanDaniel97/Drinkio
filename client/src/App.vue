<!-- <template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
  </div>
</template> -->

<template>
  <div id="app">
    <mainMenu @enterParty="enterParty" v-if="showMainMenu"></mainMenu>
    <partyRoom v-else></partyRoom>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      showMainMenu: true
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    error_message: function (val) {
      console.log('Error recieved: ', val)
    },
    created_party: function (val) {
      console.log('Created party room')
      this.showMainMenu = false
    },
    joined_party: function (val) {
      console.log('Created party room')
      this.showMainMenu = false
    }
  },
  methods: {
    enterParty (data) {
      console.log(data)
      if (data.event === 'join') {
        console.log('Joining a room with code: ', data.roomCode)
        this.$socket.emit('join_party', data.roomCode)
      } else {
        console.log('Creating a room called: ', data.roomName)
        this.$socket.emit('create_party', data.partyName)
      }
    }
  }
}
</script>
