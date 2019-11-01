<template>
  <div id="app">
    <mainMenu @enterParty="enterParty" v-if="showMainMenu"></mainMenu>
    <partyRoom v-else :partyCode='partyCode' :partyName='partyName'></partyRoom>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      showMainMenu: true,
      partyCode: '',
      partyName: ''
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
      console.log('Created party room', val)
      this.showMainMenu = false
      this.partyName = val.partyName
      this.partyCode = val.partyCode
    },
    joined_party: function (val) {
      console.log('Joined party room', val)
      this.showMainMenu = false
      this.partyName = val.partyName
      this.partyCode = val.partyCode
    }
  },
  methods: {
    enterParty (data) {
      console.log(data)
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
