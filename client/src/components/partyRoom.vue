<template>
    <div class="mar-t-80 party-room">

      <template v-if="!$store.getters.isRooomLocked">
        <h2>Welcome to</h2>
        <h1>{{ $store.getters.partyName }}</h1>
        <p>Join code: {{ $store.getters.partyCode }}</p>

        <h2 @click="setPlayerReady">Ready clck here</h2>

        <div v-if="waitingForMorePlayers">
          <p>Waiting for more players... {{waitingForMorePlayers}}</p>
        </div>

        <div v-else-if="waitingForPlayersReady">
          <p>Waiting for players to be ready...</p>
        </div>
      </template>

      <template v-else>
        <div v-if="choosingRound">
          <p>Choosing round to play</p>
        </div>

        <!--  Current round card -->
        <component v-if="$store.getters.currentRoundCard" stlye="transition-delay: 1s;" :round-data="roundData" ref="currentGameCard" v-bind:is="$store.getters.currentRoundCard"></component>

      </template>

      <!--  Plaer name modal -->
       <modal v-if="showNameModal">
         <h3 slot="header">Enter your name</h3>
         <p slot="body">
           <input v-model="playerName" type="text" placeholder="Name" name="" value="">
         </p>
         <div slot="footer">
           <button class="modal-default-button" v-on:click="setPlayerName">
             Continue
           </button>
         </div>
       </modal>

    </div>
</template>

<script>
//  Components
import Modal from './modal'
import StraightFace from './gamecards/StraightFace'
import DirtyPint from './gamecards/DirtyPint'

export default {
  name: 'partyRoom',
  components: {
    'modal': Modal,
    'StraightFace': StraightFace,
    'DirtyPint': DirtyPint
  },
  data () {
    return {
      chatMessage: '',
      playerList: [],
      showNameModal: true,
      playerName: '',
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
      this.$store.commit('setCurrentRoundCard', data.round.roundName.split(' ').join(''))
    },
    roundUpdate: function (packet) {
      this.$refs.currentGameCard.roomUpdate(packet)
    },
    roundEnd: function () {
      this.$store.commit('setCurrentRoundCard', '')
    },
    choosingRound: function () { // fired when a new round is being selected
      this.choosingRound = true
      this.waitingForMorePlayers = false
      this.waitingForPlayersReady = false
      this.$store.commit('setRoomLocked', true)
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
    setPlayerName () {
      this.showNameModal = false
      this.$socket.emit('playerName', this.playerName)
    },
    setPlayerReady () {
      this.$socket.emit('playerReady')
    }
  }
}
</script>
