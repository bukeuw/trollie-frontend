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
  methods: {
    logout () {
      this.$auth.logout()
        .then(() => {
          this.$router.push('/auth/login')
        })
    }
  }
}
</script>
