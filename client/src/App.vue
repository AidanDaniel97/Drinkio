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
    playerUpdate: function (data) {
      this.$store.commit('setPlayerUpdate', data)
    },
    createdParty: function (data) {
      console.log('Created party room', data)
      this.showMainMenu = false
      this.$store.commit('setPlayerData', data)
    },
    joinedParty: function (data) {
      console.log('Joined party room', data)
      this.showMainMenu = false
      this.$store.commit('setPlayerData', data)
    }
  },
  methods: {
    enterParty (data) {
      if (data.event === 'join') {
        console.log('Joining a room with code: ', data.partyCode)
        this.$socket.emit('join_party', data.partyCode)
      } else {
        console.log('Creating a room called: ', data.partyName)
        this.$socket.emit('create_party', data.partyName)
      }
    }
  }
}
</script>
