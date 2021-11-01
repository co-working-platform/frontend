<template>
  <v-container
    class="mx-auto"
  >
    <v-row>
      <v-dialog v-model="dialogSuccess" max-width="500px" class="success">
        <v-card>
          <v-card-title class="headline">
            {{ $t('success') }}!
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeSuccess">
              {{ $t('close') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="addCity"
        >
          {{ $t('addCity') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="deleteCity"
        >
          {{ $t('deleteCity') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updateCity"
        >
          {{ $t('updateCity') }}
        </v-btn>
      </v-col>
      <v-dialog v-model="dialogUpdateCity" max-width="500px">
        <v-form ref="formUpdateCity">
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="city in cities"
                  :key="city.id"
                  class="list"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="city.name" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      class="grey lighten-1"
                      dark
                      @click="editCity(city)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeUpdateCity">
                {{ $t('cancel') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogEditCity" max-width="500px">
        <v-form ref="formEditCity">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="editedCity" type="text" :placeholder="$t('cityName')" class="classInput">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeEditCity">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="editCityConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogDeleteCity" max-width="500px">
        <v-form ref="formDeleteCity">
          <v-card>
            <v-card-text>
              <v-select
                ref="city"
                v-model="selectDeleteCity"
                :items="cities.map(el => el.name)"
                :rules="[v => !!v || $t('itemIsRequired')]"
                :label="$t('cityChoice')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDeleteCity">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteCityConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogAddCity" max-width="500px">
        <v-form ref="formAddCity">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="cityName" type="text" :placeholder="$t('cityName')" class="classInput">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAddCity">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addCityConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
    <hr>
    <v-row>
      <v-col
        cols="4"
      >
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="createPin"
        >
          {{ $t('createCode') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col
        cols="4"
      >
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updatePin"
        >
          {{ $t('changeCode') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col
        cols="4"
      />
    </v-row>
    <v-dialog v-model="dialogAddCode" max-width="500px">
      <v-form ref="formAddCode">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <input
                    v-model="code"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    placeholder="Code"
                    class="classInput"
                    maxlength="4"
                  >
                </v-col>
                <v-col>
                  <v-select
                    ref="city"
                    v-model="selectCity"
                    :items="cities.map(el => el.name)"
                    :rules="[v => !!v || $t('itemIsRequired')]"
                    :label="$t('cityChoice')"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeAddCode">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="addCodeConfirmation">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialogUpdateCode" max-width="500px">
      <v-form ref="formUpdateCode">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <input
                    v-model="oldCode"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    :placeholder="$t('oldCode')"
                    class="classInput"
                    maxlength="4"
                  >
                </v-col>
                <v-col>
                  <input
                    v-model="newCode"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    :placeholder="$t('newCode')"
                    class="classInput"
                    maxlength="4"
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-select
                  ref="city"
                  v-model="selectCity"
                  :items="cities.map(el => el.name)"
                  :rules="[v => !!v || $t('itemIsRequired')]"
                  :label="$t('cityChoice')"
                  required
                />
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeUpdateCode">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="updateCodeConfirmation">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      code: '',
      selectDeleteCity: '',
      cities: [],
      formData: null,
      cityName: '',
      dialogAddCity: false,
      dialogDeleteCity: false,
      cityList: [],
      dialogSuccess: false,
      dialogUpdateCity: false,
      dialogEditCity: false,
      toBeDeleted: '',
      editedCity: '',
      dialogAddCode: false,
      selectCity: '',
      dialogUpdateCode: false,
      newCode: '',
      oldCode: ''
    }
  },
  watch: {
    dialogDeleteCity (val) {
      val || this.closeDeleteCity()
    },
    dialogAddCity (val) {
      val || this.closeAddCity()
    },
    dialogSuccess (val) {
      val || this.closeSuccess()
    },
    dialogAddCode (val) {
      val || this.closeAddCode()
    },
    dialogUpdateCode (val) {
      val || this.closeUpdateCode()
    }
  },
  methods: {
    /**
     * Event for create pin code button.
     */
    createPin () {
      this.dialogAddCode = true
      this.getCities()
    },

    /**
     * Hide create pin code dialog.
     */
    closeAddCode () {
      this.dialogAddCode = false
      this.selectCity = ''
      this.code = ''
    },

    /**
     * POST request to create a pin code.
     */
    addCodeConfirmation () {
      let id = 0
      this.cities.forEach((el) => {
        if (el.name === this.selectCity) {
          id = el.id
        }
      })
      this.formData = new FormData()
      this.formData.append('password', this.code)
      this.formData.append('city_id', id)
      axios({
        url: 'http://212.227.210.204:8765/ceo/add_password',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddCode()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for edit pin code button.
     */
    updatePin () {
      this.dialogUpdateCode = true
      this.getCities()
    },

    /**
     * Hide edit pin code dialog.
     */
    closeUpdateCode () {
      this.dialogUpdateCode = false
      this.selectCity = ''
      this.newCode = ''
      this.oldCode = ''
    },

    /**
     * PUT request to edit a pin code.
     */
    updateCodeConfirmation () {
      let id = 0
      this.cities.forEach((el) => {
        if (el.name === this.selectCity) {
          id = el.id
        }
      })
      this.formData = new FormData()
      this.formData.append('old', this.oldCode)
      this.formData.append('new', this.newCode)
      this.formData.append('city_id', id)
      axios({
        url: 'http://212.227.210.204:8765/ceo/change_password',
        method: 'PUT',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeUpdateCode()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Hide success message dialog.
     */
    closeSuccess () {
      this.dialogSuccess = false
      // window.location.reload()
    },

    /**
     * Event for delete city button.
     */
    deleteCity () {
      this.getCities()
      this.dialogDeleteCity = true
    },

    /**
     * Hide delete city dialog.
     */
    closeDeleteCity () {
      this.dialogDeleteCity = false
      this.selectDeleteCity = ''
    },

    /**
     * DELETE request to delete city.
     */
    deleteCityConfirmation () {
      let id = 0
      this.cities.forEach((el) => {
        if (el.name === this.selectDeleteCity) {
          id = el.id
        }
      })
      axios({
        url: 'http://212.227.210.204:8765/ceo/delete_city/' + id,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeDeleteCity()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for create city button.
     */
    addCity () {
      this.dialogAddCity = true
    },

    /**
     * Hide create city dialog.
     */
    closeAddCity () {
      this.dialogAddCity = false
      this.cityName = ''
    },

    /**
     * POST request to create a city.
     */
    addCityConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.cityName)
      axios({
        url: 'http://212.227.210.204:8765/ceo/create_city',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddCity()
      })
    },

    /**
     * GET request to obtain a list containing all the cities in the database.
     */
    getCities () {
      axios.get('http://212.227.210.204:8765/cities', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.cities = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for update cities button.
     */
    updateCity () {
      this.getCities()
      this.dialogUpdateCity = true
    },

    /**
     * Event for edit a city button.
     * @param city to be edited.
     */
    editCity (city) {
      this.toBeDeleted = city
      this.dialogEditCity = true
      this.editedCity = this.toBeDeleted.name
    },

    /**
     * Hide update cities dialog.
     */
    closeUpdateCity () {
      this.dialogUpdateCity = false
    },

    /**
     * Hide edit city dialog.
     */
    closeEditCity () {
      this.dialogEditCity = false
      this.editCity = ''
      this.closeUpdateCity()
    },

    /**
     * PUT request to edit a city.
     */
    editCityConfirmation () {
      const put = {
        id: this.toBeDeleted.id,
        name: this.editedCity
      }
      axios({
        url: 'http://212.227.210.204:8765/ceo/update_city',
        method: 'PUT',
        data: put,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeEditCity()
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

.classInput {
  border-color: #fafafa;
  border-style: solid;
}
.list {
  border-style: solid;
  border-color: darkgrey;
}
</style>
