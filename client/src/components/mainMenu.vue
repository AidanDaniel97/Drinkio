<template>
    <div class="mar-t-100">
      <div class="container">
        <h1 class="menu-title mar-b-80">Drinkio</h1>
        <div class="row">
          <div class="col-xs-12">
            <button v-on:click="showCreateModal = true" type="button" class="btn home-btn menu-buttons mar-b-30" data-toggle="modal" data-target="#roomModal">Create Party</button>
            <button v-on:click="showJoinModal = true" type="button" class="btn home-btn menu-buttons mar-b-30" data-toggle="modal" data-target="#roomModal" >Join Party</button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <modal v-if="showCreateModal">
        <h2 slot="header">Create Room</h2>
        <p slot="body">
          Enter the name of the room you wish to create:
          <input v-model="partyName" type="text" placeholder="Room Name" name="" value="">
        </p>
        <div slot="footer">
          <button class="btn" v-on:click="enterParty('create')">
            Create
          </button>
        </div>
      </modal>

      <!-- Join Modal -->
      <modal v-if="showJoinModal">
        <h2 slot="header">Join Room</h2>
        <p slot="body">
          Enter the room code to join:
          <input class="colour-black" v-model="partyCode" type="text" placeholder="Room Code" name="" value="">
        </p>
        <div slot="footer">
          <button class="btn" v-on:click="enterParty('join')">
            Join
          </button>
        </div>
      </modal>

    </div>
</template>

<script>
//  Components
import Modal from './modal'

export default {
  name: 'mainMenu',
  components: {
    'modal': Modal
  },
  data () {
    return {
      showJoinModal: false,
      showCreateModal: false,
      partyCode: '',
      partyName: ''
    }
  },
  sockets: {
    response: function (error) {
      console.log(error)
    }
  },
  methods: {
    enterParty (event) {
      if (event === 'join') {
        this.$emit('enterParty', {'event': 'join', 'partyCode': this.partyCode})
      } else {
        this.$emit('enterParty', {'event': 'create', 'partyName': this.partyName})
      }
    }
  }
}
</script>
