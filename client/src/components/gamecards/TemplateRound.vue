<!-- Used for copy, not used and delete this line! -->
<template>
  <transition name="card">
    <div class="playing-area">
        <div class="round-card">
          <h2>XXXX</h2>

          <p>xxxxxx</p>

        </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: 'XXXX',
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
    }
  },
  mounted () {
    console.log('Mounted')
  }
}
</script>
