<template>
  <v-card>
    <v-toolbar
      elevation="1"
    >
      <v-toolbar-title>{{ $t('changeYourCurrentProfilePhoto') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    <v-spacer />

    <v-form>
      <v-file-input
        v-model="files"
        class="mx-5"
        accept="image/*"
        color="deep-purple accent-4"
        counter
        :label="$t('fileInput')"
        :placeholder="$t('selectYourFile')"
        prepend-icon="mdi-paperclip"
        :show-size="1000"
        @change="uploadImage()"
      />
      <v-btn class="ml-5 mb-5" @click="submit">
        {{ $t('submit') }}
      </v-btn>
    </v-form>

    <v-dialog
      v-model="dialogSucceeded"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          {{ $t('photoUpdated') }}
        </v-toolbar>
        <v-card-text>
          <div class="text-h2 pa-12">
            {{ $t('thePhotoWasUploadedSuccessfully') }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="closeDialog"
          >
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserPhotoUpdate',
  data: () => ({
    dialogSucceeded: false,
    files: [],
    checkbox: false,
    formdata: null
  }),
  methods: {
    /**
     * Sets the request body fields.
     * @param event
     */
    uploadImage (event) {
      this.formdata = new FormData()
      this.formdata.append('photo', this.files)
    },

    /**
     * The actual PUT method to change and store the image for the user.
     */
    submit () {
      axios({
        url: 'http://212.227.210.204:8765/user/upload_photo',
        method: 'PUT',
        data: this.formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log('image upload response > ', response)
        this.dialogSucceeded = true
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Closes the dialog and redirects the user to his/her user page.
     */
    closeDialog () {
      this.dialogSucceeded = false
      this.$router.push('/user')
    }
  }
}
</script>

<style scoped>

</style>
