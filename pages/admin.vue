<template>
  <v-container>
    <v-container v-if="admin">
      <AdminComponent />
    </v-container>
    <v-container v-if="isCeo">
      <CeoComponent />
    </v-container>
  </v-container>
</template>

<script>
import CeoComponent from '@/components/admin-components/CeoComponent'
import axios from 'axios'
export default {
  components: {
    CeoComponent
  },
  data () {
    return {
      admin: false,
      isCeo: false
    }
  },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
    this.getUser()
  },
  methods: {
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        if (response.data.role.name === 'CEO') {
          this.admin = true
          this.isCeo = true
        }
        if (response.data.role.name === 'ADMIN') {
          this.admin = true
        }
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>
