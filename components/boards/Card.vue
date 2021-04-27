<template>
  <div :id="cardId" class="list-card">
    <i :id="'btn-' + cardId" ref="button" class="fa fa-pen list-card-action" />

    <div class="list-card-detail" @click="showCardDetail">
      <div class="list-card-header">
        <p>{{ card.title }}</p>
      </div>
    </div>

    <b-popover
      ref="popover"
      :target="'btn-' + cardId"
      triggers="click"
      :show.sync="popoverShow"
      placement="auto"
      @show="onShow"
    >
      <template #title>
        <b-button class="close" aria-label="Close" @click="closePopover">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>
        Card menu
      </template>

      <div>
        <div class="form-group">
          <label for="list-select">Move card to</label>
          <b-form-select
            id="list-select"
            v-model="listForm.listId"
            :options="lists"
            text-field="title"
            value-field="id"
            size="sm"
          />
        </div>

        <b-button size="sm" variant="danger" @click="closePopover">
          Cancel
        </b-button>
        <b-button size="sm" variant="primary" @click="moveCard">
          Ok
        </b-button>
      </div>
    </b-popover>

    <b-modal
      :id="`card-detail-modal${card.id}`"
      size="lg"
      hide-footer
      hide-header
    >
      <div class="card-modal-content row">
        <div class="col">
          <div class="form-group">
            <textarea v-model="cardDetail.title" class="mod-card-back-title" />
          </div>
          <div class="form-group">
            <label
              class="control-label"
              :for="`description${card.id}`"
            >
              Description
            </label>
            <textarea
              :id="`description${card.id}`"
              v-model="cardDetail.description"
              class="mod-card-description"
              placeholder="Add a more detailed description..."
              :class="descriptionEdited ? 'is-edited' : ''"
              @focus="descriptionEdited = true"
            />

            <div v-if="descriptionEdited" class="description-actions">
              <b-button variant="success" size="sm" @click="saveCardDetail">
                Save
              </b-button>
              <b-button
                variant="default"
                size="sm"
                @click="descriptionEdited = false"
              >
                <i class="fa fa-times fa-2x" />
              </b-button>
            </div>

            <div class="form-group">
              <div class="card-labels row m-0">
                <span
                  v-for="label in cardLabels"
                  :key="label.id"
                  class="card-label col"
                  :class="label.color_classes"
                  :title="label.title"
                >
                  {{ label.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-3">
          <b-dropdown
            size="sm"
            toggle-class="text-left trollie-link-button"
            no-caret
            block
          >
            <template slot="button-content">
              <i class="fa fa-tag" />
              Label
            </template>

            <b-dropdown-group header="Labels">
              <b-dropdown-item
                v-for="label in labels"
                :key="label.id"
                @click="toggleLabel(label.id)"
              >
                <span
                  class="card-label"
                  :class="label.color_classes"
                >
                  {{ label.title }}

                  <i
                    v-if="hasLabel(label.id)"
                    class="fa fa-check"
                  />
                </span>
              </b-dropdown-item>

              <b-dropdown-item v-if="labels.length === 0" disabled>
                No Label available
              </b-dropdown-item>
            </b-dropdown-group>

            <b-dropdown-divider />

            <b-dropdown-form @submit.prevent="createLabel">
              <div class="form-group">
                <input
                  v-model="labelTitle"
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Enter label title"
                  required
                >
              </div>

              <div class="form-group">
                <div
                  v-for="(color, index) in labelColorClasses"
                  :key="index"
                  class="card-label mod-clickable mod-edit-label text-center"
                  :class="color"
                  @click="labelColor = color"
                >
                  <i v-if="labelColor === color" class="fa fa-check" />
                </div>
              </div>

              <div class="form-group">
                <b-button
                  size="sm"
                  type="submit"
                  variant="success"
                  block
                >
                  Create
                </b-button>
              </div>
            </b-dropdown-form>
          </b-dropdown>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  fetch () {
    this.fetchCardDetail()
  },
  fetchOnServer: false,
  data () {
    return {
      lists: [],
      listForm: {
        listId: null
      },
      popoverShow: false,
      cardDetail: {
        title: '',
        description: ''
      },
      descriptionEdited: false,
      cardLabels: [],
      labels: [],
      labelColorClasses: [
        'label-green',
        'label-yellow',
        'label-orange',
        'label-red',
        'label-purple',
        'label-blue',
        'label-sky',
        'label-lime',
        'label-pink',
        'label-black',
        'label-default'
      ],
      labelTitle: '',
      labelColor: ''
    }
  },
  computed: {
    cardId () {
      return `card${this.cardDetail.id}`
    }
  },
  methods: {
    fetchCardDetail () {
      this.cardDetail = this.card
      this.lists = window.lists
        .filter(list => list.id !== this.cardDetail.list_id)
    },

    saveCardDetail () {
      const cardId = this.cardDetail.id
      const data = {
        title: this.cardDetail.title,
        description: this.cardDetail.description
      }

      this.$axios.$patch(`/api/cards/${cardId}`, data)
        .then(() => {
          this.descriptionEdited = false
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot save card detail: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    fetchLabels () {
      this.$axios.$get('/api/statuses')
        .then((labelsJson) => {
          this.labels = labelsJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot fetch labels: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    fetchCardLabels () {
      const cardId = this.cardDetail.id
      this.$axios.$get(`/api/statuses?card_id=${cardId}`)
        .then((labelsJson) => {
          this.cardLabels = labelsJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot fetch labels: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    toggleLabel (labelId) {
      const cardId = this.cardDetail.id
      const data = {
        card_id: cardId,
        status_id: labelId
      }

      this.$axios.$post('/api/statuses/toggle', data)
        .then(() => {
          this.fetchCardLabels()
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot fetch labels: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    createLabel () {
      const data = {
        title: this.labelTitle,
        color_classes: this.labelColor
      }
      this.$axios.$post('/api/statuses', data)
        .then(() => {
          this.clearLabelForm()
          this.fetchLabels()
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot create labels: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    clearLabelForm () {
      this.labelTitle = ''
      this.labelColor = ''
    },

    showCardDetail () {
      this.fetchLabels()
      this.fetchCardLabels()
      this.$bvModal.show(`card-detail-modal${this.card.id}`)
    },

    hasLabel (labelId) {
      return this.cardLabels.some(label => label.id === labelId)
    },

    closePopover () {
      this.popoverShow = false
    },

    moveCard () {
      const { listId } = this.listForm
      const cardId = this.cardDetail.id
      const data = {
        list_id: listId
      }

      this.$axios.$patch(`/api/cards/${cardId}`, data)
        .then(() => {
          this.popoverShow = false
          this.$emit('card-moved')
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot move card: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    onShow () {
      this.listForm.listId = null
    }
  }
}
</script>
