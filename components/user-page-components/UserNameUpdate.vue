<template>
  <v-card>
    <v-toolbar
      elevation="1"
    >
      <v-toolbar-title>{{ $t('changeYourCurrentInformation') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-text-field
        ref="name"
        v-model="firstname"
        class="ml-5 mr-5"
        :label="$t('firstName')"
        :rules="[required($t('fistName'))]"
      />

      <v-text-field
        ref="name"
        v-model="lastname"
        class="ml-5 mr-5"
        :label="$t('lastName')"
        :rules="[required($t('lastName'))]"
      />

      <v-checkbox
        v-model="checkbox"
        class="ml-5"
        :rules="[v => !!v || $t('youMustAgreeToContinue')]"
        :label="$t('isInformationCorrect')"
        required
      />

      <v-btn
        class="ml-5 mb-5"
        color="success"
        :disabled="!valid"
        @click="changeName()"
      >
        {{ $t('submit') }}
      </v-btn>
      <v-btn
        class="ml-5 mb-5"
        color="error"
        @click="resetForm()"
      >
        {{ $t('resetForm') }}
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import axios from 'axios'
import validations from '@/utils/validations'

export default {
  name: 'UserNameUpdate',
  data: () => ({
    firstname: '',
    lastname: '',
    valid: true,
    showPassword: true,
    formData: null,
    name: '',
    checkbox: false,
    ...validations
  }),

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.getUser()
  },

  methods: {
    /**
     * Gets the first and lastname of the authenticated user from the local storage.
     */
    getUser () {
      this.firstname = localStorage.getItem('logged_in_user_first')
      this.lastname = localStorage.getItem('logged_in_user_last')
    },

    /**
     * PUT request to change the name of the
     * currently loggen in user.
     */
    changeName () {
      this.formData = new FormData()
      this.formData.append('firstname', this.firstname)
      this.formData.append('lastname', this.lastname)
      axios({
        url: 'http://212.227.210.204:8765/user/update_name',
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/json; charset=utf-8'
          Authorization: this.$auth.getToken('local')
        },
        data: this.formData
      }).then((response) => {
        this.$router.push('/user')
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
      this.resetForm()
    },

    /**
     * Resets the fields of the form.
     */
    resetForm () {
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped>

</style>
