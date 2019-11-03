// import VuexPersist from 'vuex-persist'
import Vue from 'Vue'
import Vuex from 'Vuex'
Vue.use(Vuex)

// const vuexPersist = new VuexPersist({
//   key: 'drinkio',
//   storage: localStorage
// })

export default new Vuex.Store({
  state: {
    playerSocketID: '',
    playerName: '',
    currentRound: '',
    partyName: '',
    partyCode: ''
  },

  getters: {
    playerSocketID: state => state.playerSocketID,
    playerName: state => state.playerName,
    currentRound: state => state.currentRound,
    partyName: state => state.partyName,
    partyCode: state => state.partyCode
  },
  mutations: {
    setPlayerData (state, playerData) {
      state.playerSocketID = playerData.socketID
      state.partyName = playerData.partyName
      state.partyCode = playerData.partyCode
    },
    setCurrentRound (state, currentRound) {
      state.currentRound = currentRound
    },
    setPlayerUpdate (state, playerData) { // update player
      for (var data in playerData) {
        console.log(state[data], playerData[data], data)
        if (state[data] !== undefined) {
          state[data] = playerData[data]
        }
      }
    }
  }
  // plugins: [vuexPersist.plugin]
})
