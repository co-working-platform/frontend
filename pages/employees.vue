<template>
  <v-container v-if="allowed">
    <v-row justify="center">
      <v-col cols="12">
        <EmployeeRegistrationAndListing />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'
import EmployeeRegistrationAndListing from '@/components/employee-page-components/EmployeeRegistrationAndListing'
export default {
  components: { EmployeeRegistrationAndListing },
  data () {
    return {
      allowed: false
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
        if (response.data.role.name === 'CEO' || response.data.role.name === 'ADMIN' || response.data.role.name === 'DEPARTMENT') {
          this.allowed = true
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
