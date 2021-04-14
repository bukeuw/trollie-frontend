<template>
  <b-card title="Login">
    <b-card-body>
      <form @submit.prevent="login">
        <div class="form-group">
          <label class="control-label" for="email">Email</label>
          <input id="email" v-model="email" class="form-control" type="email">
        </div>

        <div class="form-group">
          <label class="control-label" for="password">Password</label>
          <input id="password" v-model="password" class="form-control" type="password">
        </div>

        <div class="form-group">
          <b-button variant="primary" type="submit">
            Login
          </b-button>
        </div>
      </form>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      // const email = this.email
      // const password = this.password
      // can be shorten like below
      const { email, password } = this
      const data = {
        email,
        password
      }
      this.$auth.loginWith('laravelJWT', { data })
        .then(() => {
          this.$bvToast.toast('Login Success', {
            title: 'Login',
            variant: 'success',
            solid: true
          })
          this.$router.push('/')
        }).catch(() => {
          this.$bvToast.toast('Login Failed', {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    }
  }
}
</script>
