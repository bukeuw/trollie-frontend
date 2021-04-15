<template>
  <div class="row">
    <div
      v-for="board in boards"
      :key="board.id"
      class="col-3 mb-3"
    >
      <router-link :to="`/boards/${board.id}`">
        <BoardTile
          :title="board.title"
          :color="board.color"
        />
      </router-link>
    </div>

    <div class="col-3">
      <BoardTile
        v-b-modal.create-board-modal
        mod="create"
        title="Create new board"
      />
    </div>

    <b-modal
      id="create-board-modal"
      centered
      hide-footer
      title="Create Board"
    >
      <form @submit.prevent="createBoard">
        <div class="form-group">
          <label class="control-label">Title</label>
          <input v-model="form.title" class="form-control" type="text">
        </div>

        <div class="form-group">
          <label class="control-label">Color</label>
          <input v-model="form.color" class="form-control" type="color">
        </div>

        <div class="form-group float-right">
          <b-button type="submit" variant="primary">
            Save
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  fetch () {
    this.fetchBoardList()
  },
  fecthOnServer: false,
  data () {
    return {
      boards: [],
      form: {
        title: '',
        color: '#28a745'
      }
    }
  },
  methods: {
    fetchBoardList () {
      this.$axios.$get('/api/boards')
        .then((boardsJson) => {
          this.boards = boardsJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Failed to fetch board: ${err}`, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    },

    createBoard () {
      const data = this.form
      this.$axios.$post('/api/boards', data)
        .then(() => {
          this.clearBoardForm()
          this.$fetch()
          this.$bvModal.hide('create-board-modal')
        })
        .catch((err) => {
          this.$bvToast.toast(`Failed to created board: ${err}`, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    },

    clearBoardForm () {
      this.form = {
        title: '',
        color: '#28a745'
      }
    }
  }
}
</script>
