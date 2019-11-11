<template>
    <div class="mar-t-80 party-room">
      <h2>Welcome to</h2>
      <h1>{{ $store.getters.partyName }}</h1>
      <p>Join code: {{ $store.getters.partyCode }}</p>

      <!-- Could move this into a seperate component -->
      <component v-if="currentRoundCard" stlye="transition-delay: 1s;" :round-data="roundData" ref="currentGameCard" v-bind:is="currentRoundCard"></component>

      <div v-else-if="waitingForMorePlayers">
        <p>Waiting for more players... {{waitingForMorePlayers}}</p>
      </div>

      <div v-else-if="waitingForPlayersReady">
        <p>Waiting for players to be ready...</p>
      </div>

      <div v-else-if="choosingRound">
        <p>Choosing round to play</p>
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
import StraightFace from './game_cards/StraightFace'

export default {
  name: 'partyRoom',
  components: {
    'modal': Modal,
    'StraightFace': StraightFace
  },
  data () {
    return {
      chatMessage: '',
      messages: [],
      showNameModal: true,
      playerName: '',
      currentRoundCard: '',
      roundData: '',
      waitingForMorePlayers: false,
      waitingForPlayersReady: false,
      choosingRound: false
    }
  },
  sockets: {
    startRound: function (data) {
      this.choosingRound = false
      this.roundData = data
      this.currentRoundCard = data.round.roundName.split(' ').join('')
    },
    roundUpdate: function (packet) {
      this.$refs.currentGameCard.roomUpdate(packet)
    },
    choosingRound: function () { // fired when a new round is being selected
      this.choosingRound = true
      this.waitingForMorePlayers = false
      this.waitingForPlayersReady = false
      console.log('Fired choosing round')
    },
    waitingForMorePlayers: function (packet) {
      console.log(packet)
      this.waitingForMorePlayers = packet.playersLeft
      this.waitingForPlayersReady = false
    },
    waitingForPlayersReady: function (packet) {
      console.log(packet)
      this.waitingForMorePlayers = false
      this.waitingForPlayersReady = true
    }
  },
  methods: {
    sendRoundUpdate (update, data) {
      this.$socket.emit(update, 'this is some test data')
    },
    sendPlayerReady () {
      this.showNameModal = false
      this.$socket.emit('playerReady', this.playerName)
    }
  }
}
</script>
