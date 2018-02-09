<template>
    <div class="">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <button v-on:click="showCreateModal = true" type="button" class="btn btn-primary menu-buttons" data-toggle="modal" data-target="#roomModal">Create Party</button>
          </div>
          <div class="col-xs-12">
            <button v-on:click="showJoinModal = true" type="button" class="btn btn-primary menu-buttons" data-toggle="modal" data-target="#roomModal" >Join Party</button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <modal v-if="showCreateModal">
        <h3 slot="header">Create Room</h3>
        <p slot="body">
          Enter the name of the room you wish to create:
          <input v-model="partyName" type="text" placeholder="Room Name" name="" value="">
        </p>
        <div slot="footer">
          <button class="modal-default-button" v-on:click="enterParty('create')">
            Create
          </button>
        </div>
      </modal>

      <!-- Join Modal -->
      <modal v-if="showJoinModal">
        <h3 slot="header">Join Room</h3>
        <p slot="body">
          Enter the room code to join:
          <input v-model="roomCode" type="text" placeholder="Room Code" name="" value="">
        </p>
        <div slot="footer">
          <button class="modal-default-button" v-on:click="enterParty('join')">
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
      roomCode: '',
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
        this.$emit('enterParty', {'event': 'join', 'roomCode': this.roomCode})
      } else {
        this.$emit('enterParty', {'event': 'create', 'partyName': this.partyName})
      }
    }
  }
}
</script>
