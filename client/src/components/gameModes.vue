<template>
    <div class="game-type-list">
      <div v-on:click="setRoomMode(gameMode)" v-for="gameMode in gameModes" :key="gameMode" class="game-type btn mar-b-30">
        {{gameMode}}
      </div>
    </div>
</template>

<script>
//  Components
export default {
  name: 'gameType',
  data () {
    return {
      gameModes: ['lockdown', 'normal'],
      selectedGameMode: ''
    }
  },
  methods: {
    setRoomMode (mode) {
      this.selectedGameMode = mode
      this.$emit('setGameMode', mode)
    }
  }
}
</script>
