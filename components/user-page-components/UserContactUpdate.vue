<template>
  <v-card>
    <v-toolbar
      elevation="1"
    >
      <v-toolbar-title>{{ $t('changeYourCurrentContactInfo') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-text-field
        v-model="contact.address"
        class="ml-5 mr-5"
        :label="$t('address')"
      />

      <v-text-field
        v-model="contact.email"
        class="ml-5 mr-5"
        label="Email"
        :rules="[required('email'), emailFormat()]"
      />

      <v-text-field
        v-model="contact.phoneNumber"
        class="ml-5 mr-5"
        :label="$t('phoneNumber')"
        :rules="[required($t('phoneNumber')), numberFormat()]"
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
        @click="changeContact()"
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
  name: 'UserChanges',
  data: () => ({
    formdata: null,
    contact: {
      address: '',
      phoneNumber: '',
      email: ''
    },
    valid: true,
    checkbox: false,
    ...validations
  }),
  methods: {
    /**
     * PUT method to change the contact details of the authenticated user.
     */
    changeContact () {
      this.formdata = new FormData()
      this.formdata.append('address', this.contact.address)
      this.formdata.append('phoneNo', this.contact.phoneNumber)
      this.formdata.append('email', this.contact.email)
      axios({
        url: 'http://212.227.210.204:8765/user/update_contact',
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Content-Type': 'application/json; charset=utf-8'
          Authorization: this.$auth.getToken('local')
        },
        data: this.formdata
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
