<template>
  <v-container v-if="$fetchState.pending">
    <v-skeleton-loader
      type="card"
    />
  </v-container>
  <v-container
    v-else
    class="mx-auto"
  >
    <v-form ref="form">
      <v-toolbar>
        <v-container>
          <label class="title">{{ $t('myDepartments') }}</label>
        </v-container>
        <v-toolbar id="searchBar" elevation="0">
          <v-icon class="mr-2">
            mdi-magnify
          </v-icon>
          <input v-model="lookup" type="text" :placeholder="$t('searchDepartment')">
        </v-toolbar>
      </v-toolbar>
      <hr>
      <v-list
        subheader
        two-line
      >
        <v-list-item
          v-for="department in filteredDepartments"
          id="departmentList"
          :key="department.id"
          :to="`/basefolder/${ department.id }`"
        >
          <v-list-item-avatar>
            <v-icon
              class="grey lighten-1"
              dark
            >
              mdi-folder
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="department.name" />
          </v-list-item-content>
        </v-list-item>
        <v-divider inset />
      </v-list>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      lookup: '',
      formData: null,
      departmentList: [],
      user: ''
    }
  },
  async fetch () {
    await this.getDepartments()
  },
  computed: {
    filteredDepartments () {
      return this.departmentList.filter((d) => {
        return d.name.toLowerCase().match(this.lookup.toLowerCase())
      })
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.getUser()
  },
  methods: {
    /**
     * Get request to obtain the authenticated user
     */
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.user = response.data
        this.getDepartments()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * GET request to obtain a list with all the department within authenticated user's city.
     * @param event
     */
    getDepartments (event) {
      axios.get('http://212.227.210.204:8765/departments/' + this.user.employee.department.city.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const aux = response.data
        aux.forEach((el) => {
          if (el.name !== 'CeoDepartment') {
            this.departmentList.push(el)
          }
        })
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>

<style scoped>
.title {
  font-size: xx-large;
}
</style>
