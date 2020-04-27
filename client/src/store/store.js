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
    currentRoom: '',
    currentRoundCard: '',
    playersList: [],
    playerSocketID: '',
    playerName: '',
    currentRound: '',
    partyName: '',
    partyCode: '',
    isRooomLocked: false
  },

  getters: {
    currentRoom: state => state.currentRoom,
    currentRoundCard: state => state.currentRoundCard,
    playersList: state => state.playersList,
    playerSocketID: state => state.playerSocketID,
    playerName: state => state.playerName,
    currentRound: state => state.currentRound,
    partyName: state => state.partyName,
    partyCode: state => state.partyCode,
    isRooomLocked: state => state.isRooomLocked
  },
  mutations: {
    setCurrentRoundCard (state, card) {
      state.currentRoundCard = card
    },
    setCurrentRoom (state, room) {
      state.currentRoom = room
    },
    setPlayerData (state, playerData) {
      state.playerSocketID = playerData.socketID
      state.partyName = playerData.partyName
      state.partyCode = playerData.partyCode
    },
    set (state, playerData) {
      state.playerSocketID = playerData.socketID
      state.partyName = playerData.partyName
      state.partyCode = playerData.partyCode
    },
    setCurrentRound (state, currentRound) {
      state.currentRound = currentRound
    },
    setRoomLocked (state, value) {
      state.isRooomLocked = value
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
