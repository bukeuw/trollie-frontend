<template>
  <div>
    <div
      v-if="$fetchState.pending"
      class="text-center"
    >
      <b-spinner label="loading" />
    </div>
    <b-card
      v-else
      :title="board.title"
    >
      <b-card-body>
        <List
          v-for="list in lists"
          :key="list.id"
          :list="list"
        />

        <List is-form :form-action="addList" />
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  fetch () {
    this.fetchBoard()
    this.fetchList()
  },
  fetchOnServer: false,
  data () {
    return {
      board: {},
      lists: []
    }
  },
  methods: {
    fetchBoard () {
      const boardId = this.$route.params.id
      this.$axios.$get(`/api/boards/${boardId}`)
        .then((boardJson) => {
          this.board = boardJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Failed to fetch board: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    fetchList () {
      const boardId = this.$route.params.id
      this.$axios.$get(`/api/lists?board_id=${boardId}`)
        .then((listsJson) => {
          this.lists = listsJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Failed to fetch list: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    addList (title) {
      const boardId = this.$route.params.id
      const data = {
        title,
        board_id: boardId
      }
      this.$axios.$post('/api/lists', data)
        .then(() => {
          this.$fetch()
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot add list: ${err}`, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    }
  }
}
</script>
