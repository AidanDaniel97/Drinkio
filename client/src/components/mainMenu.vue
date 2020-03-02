<template>
    <div class="mar-t-100">
      <div class="container">
        <h1 class="menu-title mar-b-80">Quaff</h1>
        <div class="row">
          <div class="col-xs-12">
            <button v-on:click="showCreateModal = true" type="button" class="btn home-btn menu-buttons mar-b-30" data-toggle="modal" data-target="#roomModal">Create Party</button>
            <button v-on:click="showJoinModal = true" type="button" class="btn home-btn menu-buttons mar-b-30" data-toggle="modal" data-target="#roomModal" >Join Party</button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <modal v-if="showCreateModal">
        <h1 slot="header">Create Room</h1>
        <div slot="body">
          <h3>
            Enter your room name:
          </h3>
          <input v-model="partyName" v-on:keyup.enter="enterParty('create')" type="text" placeholder="Room Name" name="" value="">
        </div>
        <div slot="footer">
          <button class="btn" v-on:click="enterParty('create')">
            Create
          </button>
        </div>
      </modal>

      <!-- Join Modal -->
      <modal v-if="showJoinModal">
        <h1 slot="header">Join Room</h1>
        <div slot="body">
          <h3>
            Enter the room 4-digit room code:
          </h3>
          <input class="colour-black" v-on:keyup.enter="enterParty('join')" v-model="partyCode" type="text" placeholder="Room Code" name="" value="">
        </div>
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
