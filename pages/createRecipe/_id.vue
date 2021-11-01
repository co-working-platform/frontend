<template>
  <v-container v-if="managment">
    <CreateRecipeComponent />
  </v-container>
</template>
<script>
import axios from 'axios'
import CreateRecipeComponent from '@/components/product-page-components/CreateRecipeComponent'
export default {
  components: { CreateRecipeComponent },
  data () {
    return {
      managment: false
    }
  },
  mounted () {
    this.getUser()
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  },
  methods: {
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        if (response.data.role.name === 'CEO' || response.data.role.name === 'ADMIN' || response.data.role.name === 'DEPARTMENT') {
          this.managment = true
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
