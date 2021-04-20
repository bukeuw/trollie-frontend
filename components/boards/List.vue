<template>
  <div class="list-wrapper">
    <div class="list">
      <div v-if="isForm" class="list-form">
        <form @submit.prevent="addList">
          <input
            v-model="form.listTitle"
            class="form-control"
            type="text"
            placeholder="+ Add another list"
          >
        </form>
      </div>

      <div v-else>
        <div class="list-header">
          <h5>{{ list.title }}</h5>
        </div>

        <div class="list-cards">
          <Card
            v-for="card in cards"
            :key="card.id"
            :card="card"
            @card-moved="cardMoved"
          />

          <div class="card-form">
            <form @submit.prevent="addCard">
              <input
                v-model="form.cardTitle"
                class="form-control"
                type="text"
                placeholder="+ Add another card"
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => ({})
    },
    isForm: {
      type: Boolean,
      default: false
    },
    formAction: {
      type: Function,
      default: () => {}
    },
    cardMoved: {
      type: Function,
      default: () => {}
    }
  },
  fetch () {
    if (!this.isForm) {
      this.fetchCards()
    }
  },
  fetchOnServer: false,
  data () {
    return {
      cards: [],
      form: {
        listTitle: '',
        cardTitle: ''
      }
    }
  },
  methods: {
    fetchCards () {
      const listId = this.list.id
      this.$axios.$get(`/api/cards?list_id=${listId}`)
        .then((cardsJson) => {
          this.cards = cardsJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot fetch cards: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    addCard () {
      const cardTitle = this.form.cardTitle
      const listId = this.list.id
      const data = {
        title: cardTitle,
        list_id: listId
      }

      this.$axios.$post('/api/cards', data)
        .then(() => {
          this.form.cardTitle = ''
          this.$fetch()
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot create card: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    addList () {
      const listTitle = this.form.listTitle
      this.formAction(listTitle)
        .then(() => {
          this.form.listTitle = ''
        })
    }
  }
}
</script>
