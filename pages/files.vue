<template>
  <v-container v-if="allowed">
    <v-container v-if="admin">
      <File-download-component />
    </v-container>
    <v-container
      v-if="!admin"
      class="mx-auto"
    >
      <v-form ref="form">
        <v-toolbar
          color="transparent"
          dark
        >
          <v-container>
            <label class="title">{{ $t('myDepartments') }}</label>
          </v-container>
        </v-toolbar>
        <v-list
          subheader
          two-line
        >
          <v-list-item v-if="!admin">
            <v-list-item-avatar>
              <router-link :to="`/baseFolder/${ departmentId }`" class="router">
                <v-icon
                  class="grey lighten-1"
                  dark
                >
                  mdi-folder
                </v-icon>
              </router-link>
            </v-list-item-avatar>
            <v-item-title v-text="departmentName" />
          </v-list-item>
        </v-list>
      </v-form>
    </v-container>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      user: '',
      admin: true,
      departmentId: 0,
      departmentName: '',
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
        this.user = response.data
        localStorage.setItem('role', this.user.role.name)
        if (this.user.role.name === 'ADMIN' || this.user.role.name === 'CEO') {
          this.admin = true
          this.allowed = true
        } else {
          this.admin = false
          this.departmentName = this.user.employee.department.name
          this.departmentId = this.user.employee.department.id
        }
        if (this.user.role.name === 'DEPARTMENT') {
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
