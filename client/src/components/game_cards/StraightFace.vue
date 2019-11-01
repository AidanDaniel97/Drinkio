<template>
  <div class="playing-area">
    <div class="round-card">
      <h2>Straight Face</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StraightFace',
  props: ['currentRound'],
  data () {
    return {
    }
  },
  sockets: {
  },
  methods: {
    roundUpdate: function (update) {
      console.log('Got round update: ', update)
    }
  },
  mounted () {
    console.log('Mounted')
  }
}
</script>
