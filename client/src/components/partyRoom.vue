<template>
    <div class="mar-t-80 party-room">

      <template v-if="!$store.getters.isRooomLocked">
        <h1>{{ $store.getters.partyName }}</h1>
        <h3>Join code: {{ $store.getters.partyCode }}</h3>

        <div v-if="!readyClicked" class="ready-button-holder">
          <button class="ready-btn btn" @click="setPlayerReady">
            Ready?
          </button>
        </div>

        <div v-if="waitingForMorePlayers">
          <h3>
            <span v-if="waitingForMorePlayers == 1">Waiting for 1 more player</span>
            <span v-else>Waiting for {{waitingForMorePlayers}} more players</span>
          </h3>
        </div>

        <div v-else-if="waitingForPlayersReady">
          <h3>Waiting for players to be ready...</h3>
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
           <button class="btn" v-on:click="setPlayerName">
             Join
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
      choosingRound: false,
      readyClicked: false
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
      this.readyClicked = true
      this.$socket.emit('playerReady')
    }
  }
}
</script>
