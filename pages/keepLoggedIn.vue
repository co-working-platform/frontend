<template>
  <v-container>
    <v-dialog v-model="dialogLogin" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Your session expired. Would you like to remain logged in?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            No
          </v-btn>
          <v-btn color="blue darken-1" text @click="confirm">
            Yes
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      dialogLogin: true,
      formData: null
    }
  },
  methods: {
    confirm () {
      this.formData = new URLSearchParams()
      this.formData.append('grant_type', 'refresh_token')
      this.formData.append('refresh_token', localStorage.getItem('token'))
      axios({
        url: 'http://212.227.210.204:8765/oauth/token',
        method: 'POST',
        data: this.formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: 'my-trusted-client',
          password: 'secret'
        }
      }).then((response) => {
        this.$auth.setToken('local', 'Bearer ' + response.data.access_token)
        localStorage.setItem('token', response.data.refresh_token)
        window.location = '/'
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },
    close () {
      localStorage.clear()
      this.$auth.logout().then(() => this.$router.push('/login'))
    }
  }

}
</script>

<style scoped>

</style>
