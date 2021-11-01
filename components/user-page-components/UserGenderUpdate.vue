<template>
  <v-card>
    <v-toolbar
      elevation="1"
    >
      <v-toolbar-title>{{ $t('changeYourCurrentGender') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-select
        ref="gender"
        v-model="gender"
        class="ml-5 mr-5"
        :items="genders"
        :rules="[v => !!v || $t('itemIsRequired')]"
        :label="$t('gender')"
        required
      />

      <v-checkbox
        v-model="checkbox"
        class="ml-5 mr-5"
        :rules="[v => !!v || $t('youMustAgreeToContinue')]"
        :label="$t('isInformationCorrect')"
        required
      />

      <v-btn
        class="ml-5 mb-5"
        color="success"
        :disabled="!valid"
        @click="changeGender()"
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
    gender: '',
    genders: [
      'Female',
      'Male',
      'Prefer not to say'
    ],
    valid: true,
    checkbox: false,
    ...validations
  }),
  methods: {
    /**
     * PUT request to change the gender of the
     * currently logged in user.
     * */
    changeGender () {
      this.formData = new FormData()
      this.formData.append('gender', this.gender)
      axios({
        url: 'http://212.227.210.204:8765/user/update_gender',
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
