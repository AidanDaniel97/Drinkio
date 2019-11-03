<template>
  <div class="playing-area">
    <div class="round-card">
      <h2>Straight Face</h2>

      <template v-if="isReadingPlayer">
        <h3>{{playerName}}, you are the reader</h3>
      </template>

      <template v-else>
         <h3>{{playerName}}, you are a writer</h3>
         <input v-model="readingResponse" type="text" name="" value="">
         <div class="" v-on:click="sendReadingResponse">
           submit
         </div>
      </template>

    </div>
  </div>
</template>

<script>
export default {
  name: 'StraightFace',
  props: ['roundData'],
  data () {
    return {
      readingResponse: ''
    }
  },
  sockets: {
  },
  methods: {
    roundUpdate: function (update) {
      console.log('Got round update: ', update)
    },
    sendReadingResponse: function () {
      this.$socket.emit('roundUpdate', {
        'update': 'readingResponse',
        'data': this.readingResponse
      })
    }
  },
  computed: {
    isReadingPlayer: function () {
      return this.roundData.readingPlayer.socket === this.$store.getters.playerSocketID
    },
    playerName: function () {
      return this.$store.getters.playerName
    }
  },
  mounted () {
    console.log('Mounted')
  }
}
</script>
