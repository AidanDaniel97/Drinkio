<template>
  <transition name="card">
    <div class="playing-area">
        <div class="round-card">
          <h2>Straight Face</h2>

          <template v-if="isReadingPlayer">
            <h3>{{playerName}}, you are the reader</h3>

            <div v-if="allWriterResponses.length > 0" class="">
              <template v-if="!chosenWriterResponse">
                <p>Tap the one that makes you smile</p>
                <ul>
                  <li v-on:click="revealWriter(response)" v-for="response in allWriterResponses" :key="response.socket">{{response.writerResponse}}</li>
                </ul>
              </template>
              <template v-else>
                <p>You chose {{chosenWriterResponse.playerName}}'s answer: </p>
                <h3>{{chosenWriterResponse.writerResponse}}</h3>

                <div v-on:click="endRound()" v-if="endRoundBtn" class="btn">
                  End Turn
                </div>
              </template>

            </div>
          </template>

          <template v-else>
             <h3>{{playerName}}, you are a writer</h3>

             <div v-if="showWritingInput">
               <input v-model="writerResponse" type="text" name="" value="">
               <div class="" v-on:click="sendWritingResponse">
                 submit
               </div>
             </div>

             <div v-else-if="!chosenWriterResponse">
                <p>You have sent your message to {{readingPlayer}}</p>
             </div>

             <div v-else-if="isWinner">
               <p>Congrats, you won!</p>
             </div>
             <div v-else>
               <p>Sorry, you haven't won this round</p>
             </div>
          </template>

        </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: 'StraightFace',
  props: ['roundData'],
  data () {
    return {
      writerResponse: '',
      showWritingInput: true,
      allWriterResponses: '',
      chosenWriterResponse: false,
      endRoundBtn: false,
      isWinner: false
    }
  },
  sockets: {
    writerResponses: function (responses) {
      if (this.isReadingPlayer) {
        this.allWriterResponses = responses
      }
    },
    writingResponseChosen: function (data) {
      console.log(data)
      this.chosenWriterResponse = data
      if (data.socket === this.playerSocketID) {
        this.isWinner = true
        // COnfetti , congrats message
      }
    }
  },
  methods: {
    roundUpdate: function (update) {
      console.log('Got round update: ', update)
    },
    sendWritingResponse: function () {
      this.showWritingInput = false
      this.$socket.emit('roundUpdate', {
        'update': 'writerResponse',
        'data': this.writerResponse
      })
    },
    revealWriter: function (response) {
      this.chosenWriterResponse = response
      this.$socket.emit('roundUpdate', {
        'update': 'writerResponseChosen',
        'data': this.chosenWriterResponse
      })
      setTimeout(function () {
        this.endRoundBtn = true
      }.bind(this), 2000)
    },
    endRound: function () {
      this.$socket.emit('endRound')
    }
  },
  computed: {
    isReadingPlayer: function () {
      return this.roundData.readingPlayer.socket === this.$store.getters.playerSocketID
    },
    readingPlayer: function () {
      return this.roundData.readingPlayer.playerName
    },
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
