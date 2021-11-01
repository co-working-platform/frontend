<template>
  <v-card>
    <section v-if="authenticated">
      {{ $router.push("/user") }}
    </section>
    <section v-if="!authenticated" class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <h2 class="title has-text-centered">
              {{ $t('welcome') }}
            </h2>

            <form method="post" @submit.prevent="login">
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    v-model="email"
                    type="text"
                    class="input"
                    name="email"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input
                    v-model="password"
                    type="password"
                    class="input"
                    name="password"
                  >
                </div>
              </div>
              <div class="control">
                <button type="submit" class="button is-dark is-fullwidth">
                  {{ $t('logIn') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </v-card>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: null,
      formdata: null,
      authenticated: false
    }
  },
  computed: {
    errorMessage () {
      if (this.$store.state.i18n.locale === 'fr') {
        return 'Identifiants incorrects!'
      } else {
        return 'Wrong credentials!'
      }
    }
  },
  mounted () {
    this.isAuthenticated()
  },
  methods: {
    isAuthenticated () {
      if (this.$auth.loggedIn === false) {
        this.authenticated = false
      } else {
        this.authenticated = true
      }
    },
    login () {
      this.formdata = new URLSearchParams()
      this.formdata.append('grant_type', 'password')
      this.formdata.append('username', this.email)
      this.formdata.append('password', this.password)
      this.$auth.loginWith('local', {
        data: this.formdata
      }).then((response) => {
        localStorage.setItem('token', response.data.refresh_token)
        window.location.reload()
      }).catch((error) => {
        console.log(error)
        window.alert(this.errorMessage)
        window.location.reload()
      })
    }
  }
}
</script>

<style>
</style>
