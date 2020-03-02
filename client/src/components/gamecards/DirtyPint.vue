<!-- Used for copy, not used and delete this line! -->
<template>
  <transition name="card">
    <div class="playing-area">
        <div class="round-card">
          <h2>Dirty Pint</h2>
          <h3>{{roundData.currentPlayer.playerName}} add to the pint.</h3>

          <div v-on:click="endRound()" v-if="endRoundBtn && currentPlayerTurn" class="btn">
            End Turn
          </div>

        </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: 'DirtyPint',
  props: ['roundData'],
  data () {
    return {
      endRoundBtn: false
    }
  },
  sockets: {
  },
  methods: {
    roundUpdate: function (update) {
      console.log('Got round update: ', update)
    },
    endRound: function () {
      this.$socket.emit('endRound')
    }
  },
  computed: {
    playerName: function () {
      return this.$store.getters.playerName
    },
    playerSocketID: function () {
      return this.$store.getters.playerSocketID
    },
    currentPlayerTurn: function () {
      return this.playerSocketID === this.roundData.currentPlayer.socket
    }
  },
  mounted () {
    setTimeout(function () {
      this.endRoundBtn = true
    }.bind(this), 2000)
  }
}
</script>
