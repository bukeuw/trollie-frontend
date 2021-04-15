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

          <div
            v-for="card in cards"
            :key="card.id"
            class="card-list"
          >
            <h5>{{ card.title }}</h5>
            <p>{{ card.description }}</p>
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
      //
    },

    addCard () {
      //
    },

    addList () {
      const listTitle = this.form.listTitle
      this.formAction(listTitle)
    }
  }
}
</script>

<style scoped>
.list-wrapper {
  width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
}

.list {
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
}

.list-header {
  flex: 0 0 auto;
  padding: 10px 8px;
  position: relative;
  min-height: 20px;
}

.list-cards {
  flex: 1 1 auto;
  margin-bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 4px;
  padding: 0 4px;
  z-index: 1;
  min-height: 0;
}
.list-card {
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgb(9 30 66 / 25%);
  cursor: pointer;
  display: block;
  margin-bottom: 8px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  text-decoration: none;
  z-index: 0;
}
.list-card-detail {
  overflow: hidden;
  padding: 6px 8px 2px;
  position: relative;
  z-index: 10;
}
.list-card-title {
  clear: both;
  display: block;
  margin: 0 0 0 4px;
  overflow: hidden;
  text-decoration: none;
  word-break: break-word;
  color: #172b4d;
}
.list-card-members {
  float: right;
  margin: 0 -2px 0 0;
}
.list-card-members .member {
  height: 28px;
  width: 28px;
  background-color: #dfe1e6;
  border-radius: 25em;
  cursor: pointer;
  display: block;
  overflow: visible;
  position: relative;
  user-select: none;
  z-index: 0;
}
.list-card-labels {
  overflow: auto;
  position: relative;
}
.card-label.mod-card-front {
  float: left;
  font-size: 12px;
  font-weight: 700;
  height: 8px;
  line-height: 100px;
  margin: 0 4px 4px 0;
  max-width: 40px;
  min-width: 40px;
  padding: 0;
  text-shadow: none;
  width: auto;
}
.card-label {
  background-color: #b3bac5;
  border-radius: 4px;
  color: #fff;
  display: block;
  margin-right: 4px;
  max-width: 100%;
  overflow: hidden;
  padding: 4px 6px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list input {
  background-color: #ebecf0;
  border-color: #ebecf0;
  color: #5e6c84;
}
.list input:hover {
  background-color: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}
.list input:focus {
  background-color: white;
}
.card-form {
  margin: 8px;
  padding: 4px;
}
</style>
