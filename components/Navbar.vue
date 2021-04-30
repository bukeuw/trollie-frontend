<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#">
      Trollie
    </b-navbar-brand>

    <b-navbar-toggle target="navbar-collapse" />

    <b-collapse id="navbar-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown
          v-if="$auth.loggedIn"
          right
        >
          <template #button-content>
            <i class="fa fa-bell" />

            <b-badge
              v-if="notifications.length > 0"
              variant="danger"
            >
              {{ notifications.length }}
            </b-badge>
          </template>

          <b-dropdown-item
            v-for="(notif, index) in notifications"
            :key="index"
          >
            <strong>{{ notif.user }}</strong> has moved card
            <strong>{{ notif.card_title }}</strong>
            from <strong>{{ notif.from_title }}</strong>
            to <strong>{{ notif.to_title }}</strong>
          </b-dropdown-item>

          <b-dropdown-item v-if="notifications.length === 0">
            no notification
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown
          v-if="$auth.loggedIn"
          :text="$auth.user.name"
          right
        >
          <b-dropdown-item @click="logout">
            Logout
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  fetch () {
    this.fetchNotification()

    this.$channel.bind('client-card-moved', (data) => {
      this.fetchNotification()
    })
  },
  fetchOnServer: false,
  data () {
    return {
      notifications: []
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
        .then(() => {
          this.$router.push('/auth/login')
        })
    },

    fetchNotification () {
      const userId = this.$auth.user.id
      return this.$axios.$get(`/api/users/${userId}/notifications`)
        .then((notifJson) => {
          this.notifications = notifJson.data
        })
        .catch((err) => {
          this.$bvToast.toast(`Cannot fetch notifications: ${err}`, {
            title: 'error',
            variant: 'danger',
            solid: true
          })
        })
    },

    getNotifMessage (notif) {
      const msg = `${notif.user} has moved card '${notif.card_title}' from ${notif.from_title} to ${notif.to_title}`

      return msg
    }
  }
}
</script>
