<template>
  <v-card>
    <!-- <v-img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBs-ekBVhKeAaZOAuegxf03CfxYwYFdvUiuw&usqp=CAU"
      height="300px"
      dark
    /> -->
    <v-card-title class="ml-2">
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item>
              <v-list-item-avatar>
                <!-- <v-img><v-icon>mdi-account</v-icon></v-img> -->
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item-title>
              {{ $t('username') }}: {{ user.username }}
            </v-list-item-title>
            <v-list-item-subtitle> Contact: {{ user.employee.contact.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-title>
    <v-list class="ml-5">
      <v-list-item-group
        color="primary"
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in finalItems"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserAccount',
  data () {
    return {
      selectedItem: [
        '1'
      ],
      user: {
        id: '',
        username: '',
        password: '',
        roles: [],
        employee: {
          id: '',
          name: '',
          jobPosition: '',
          description: '',
          salary: 0,
          contractType: '',
          employmentTime: 0,
          gender: '',
          photo: '',
          contact: {
            id: '',
            address: '',
            phoneNumber: '',
            email: ''
          },
          department: {
            id: '',
            name: '',
            city: {
              id: '',
              name: ''
            }
          },
          folder: {
            id: '',
            name: '',
            department: {
              id: '',
              name: '',
              city: {
                id: '',
                name: ''
              }
            },
            base: true
          }
        }
      },
      items: [
        {
          icon: 'mdi-lock-outline',
          title: 'Change Password',
          to: '/change_password'
        },
        {
          icon: 'mdi-image-outline',
          title: 'Change Photo',
          to: '/change_photo'
        },
        {
          icon: 'mdi-gender-male-female',
          title: 'Change Gender',
          to: '/change_gender'
        },
        {
          icon: 'mdi-rename-box',
          title: 'Change Name',
          to: '/change_username'
        },
        {
          icon: 'mdi-information-outline',
          title: 'Change Contact Info',
          to: '/change_contact'
        }
      ],
      finalItems: [],
      title: 'Co-working platform'
    }
  },

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.getUser()
  },

  methods: {
    /**
     * GET method to get the authenticated user.
     * Also, sets the first and last name of the logged in user
     * in the local storage for further features, such as changing the name.
     */
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.user = response.data
        localStorage.setItem('logged_in_user_first', this.user.employee.firstname)
        localStorage.setItem('logged_in_user_last', this.user.employee.lastname)
        if (this.user.role.name === 'CEO' || this.user.role.name === 'ADMIN') {
          this.finalItems = this.items
        }
        if (this.user.role.name === 'EMPLOYEE' || this.user.role.name === 'DEPARTMENT') {
          this.items.forEach((el) => {
            if (el.title !== 'Employees') {
              this.finalItems.push({
                icon: el.icon,
                title: el.title,
                to: el.to
              })
            }
          })
        }
        if (this.user.employee.folder !== null) {
          this.finalItems.push({
            icon: 'mdi-chart-bubble',
            title: 'Folder',
            to: '/employeeFolder/' + this.user.employee.folder.id
          })
        }
      }).catch((error) => {
        if (this.user.employee.photo === null) {
          return
        }
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
