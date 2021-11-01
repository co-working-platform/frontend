<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-container v-if="authenticated">
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
        </v-container>

        <v-list-item
          v-else
          :to="home.to"
          exact
          router
        >
          <v-list-item-action>
            <v-icon> {{ home.icon }} </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="home.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-autocomplete
        v-if="ceo"
        ref="city"
        v-model="selectCity"
        class="city"
        :items="cities.map(el => el.name)"
        :rules="[v => !!v || 'Item is required']"
        :label="$t('cityChoice')"
        required
        @change="saveCity"
        @click="cityList"
      />
      <v-btn v-if="notAuthenticated" to="/login">
        {{ $t('login') }}
      </v-btn>
      <v-spacer />
      <v-btn v-if="authenticated" @click="logout">
        {{ $t('logout') }}
      </v-btn>
      <v-spacer />
      <router-link v-if="authenticated" to="/user">
        <v-list-item-avatar>
          <v-img id="image" :src="'data:image/*;base64,' + photo" />
        </v-list-item-avatar>
      </router-link>
      <LanguageInput />
    </v-app-bar>
    <v-main>
      <v-container class="pa-10" fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
import LanguageInput from '@/components/LanguageInput'
export default {
  components: { LanguageInput },
  data () {
    return {
      cities: [],
      photo: '',
      selectCity: '',
      user: null,
      notAuthenticated: true,
      authenticated: false,
      clipped: false,
      drawer: false,
      fixed: false,
      home: {
        icon: 'mdi-login',
        title: 'Login',
        to: '/login'
      },
      items: [
        {
          icon: 'mdi-apps',
          title: 'Settings',
          to: '/user'
        },
        {
          icon: 'mdi-account-group',
          title: 'Employees',
          to: '/employees'
        },
        {
          icon: 'mdi-basket',
          title: 'Products',
          to: '/products'
        },
        {
          icon: 'mdi-folder-account',
          title: 'Files',
          to: '/files'
        },
        {
          icon: 'mdi-calendar',
          title: 'Planning',
          to: '/planning'
        },
        {
          icon: 'mdi-shield-crown-outline',
          title: 'Admin',
          to: '/admin'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Noé Workspace',
      ceo: false,
      finalItems: []
    }
  },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.setInterval(() => {
        this.isAuthenticated()
      }, 1000)
    } else {
      this.isAuthenticated()
      this.setItems()
      this.title = this.title + ' <------> ' + this.$auth.user.employee.department.city.name
      this.photo = this.$auth.user.employee.photo
    }
  },
  methods: {
    async logout () {
      localStorage.clear()
      this.$router.push('/')
      await this.$auth.logout()
      await window.location.reload()
    },
    getCityById (cityName) {
      this.getCities()
      this.cities.forEach((el) => {
        if (el.name === cityName) {
          localStorage.setItem('cityId', el.id)
        }
      })
      // window.location.reload()
      this.formData = new FormData()
      this.formData.append('city_id', localStorage.getItem('cityId'))
      axios({
        url: 'http://212.227.210.204:8765/admin/user/update_city',
        method: 'PUT',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        // window.location.reload()
        window.location = '/'
      }).catch((error) => {
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },
    isAuthenticated () {
      if (this.$auth.loggedIn === false) {
        this.notAuthenticated = true
        this.authenticated = false
      } else {
        this.notAuthenticated = false
        this.authenticated = true
        this.user = this.$auth.user
        localStorage.setItem('role', this.user.role.name)
        if (this.user.role.name === 'CEO') {
          this.ceo = true
        }
      }
    },
    getCities (event) {
      if (this.authenticated) {
        axios.get('http://212.227.210.204:8765/cities', {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }).then((response) => {
          this.cities = response.data
        }).catch((error) => {
          const response = error.response
          console.log(JSON.stringify(response.data.errors))
        })
      }
    },
    saveCity () {
      localStorage.setItem('cityName', this.selectCity)
      this.getCityById(this.selectCity)
    },
    cityList () {
      this.getCities()
    },
    setItems () {
      if (this.authenticated === true) {
        if (this.user.role.name === 'CEO' || this.user.role.name === 'ADMIN') {
          this.finalItems = this.items
        }
        if (this.user.role.name === 'DEPARTMENT') {
          this.items.forEach((el) => {
            if (el.title !== 'Admin') {
              this.finalItems.push(el)
            }
          })
        }
        if (this.user.role.name === 'EMPLOYEE') {
          this.items.forEach((el) => {
            if (el.title !== 'Admin' && el.title !== 'Files') {
              this.finalItems.push({
                icon: el.icon,
                title: el.title,
                to: el.to
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.myClass {
  background: #1e1e1e;
  color: snow;
}
.router {
  color: snow;
}
.city {
  margin-top: 30px;
  width: 80px;
}
</style>
