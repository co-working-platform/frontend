<template>
  <v-container
    class="mx-auto"
  >
    <v-form ref="form">
      <v-toolbar
        color="transparent"
        dark
      >
        <v-container>
          <v-row>
            <v-col align-self="center">
              <label class="title">{{ $t('uploadAFile') }}</label>
            </v-col>
            <v-col align-self="center" class="text-right">
              <v-btn class="myClass">
                <router-link to="/user" class="router">
                  {{ $t('userPage') }}
                </router-link>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
      <hr>
      <hr>
      <hr>
      <v-row>
        <v-container v-if="managment">
          <input id="employeeCheckbox" v-model="employeeCheckbox" type="checkbox">
          <label class="text">{{ $t('availableForEmployee') }}</label>
        </v-container>
      </v-row>
      <hr>
      <v-file-input
        ref="file"
        v-model="fileModel"
        color="deep-purple accent-4"
        counter
        :label="$t('fileInput')"
        placeholder="Select your files"
        prepend-icon="mdi-paperclip"
        :show-size="1000"
        @change="handleFileUpload()"
      />
      <hr>
      <v-btn
        class="myClass"
        @click="submitFile"
      >
        {{ $t('submit') }}
      </v-btn>
      <v-col />
      <v-row />
      <v-card />
      <hr>
    </v-form>
    <v-dialog v-model="dialogSuccess" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ $t('theFileWasUploaded') }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            {{ $t('close') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  /*
      Defines the data used by the component
    */
  data () {
    return {
      formData: null,
      selectDepartment: '',
      departments: [],
      folders: [],
      allDepartments: [],
      user: null,
      fileModel: '',
      dialogSuccess: false,
      selectFolder: '',
      employeeCheckbox: false,
      managment: false
    }
  },
  watch: {
    dialogSuccess (val) {
      val || this.close()
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.checkRole()
  },
  methods: {
    /**
     * Check if the authenticated user is allowed to set the availability for employee field.
     */
    checkRole () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const user = response.data
        if (user.role.name === 'ADMIN' || user.role.name === 'CEO' || user.role.name === 'DEPARTMENT') {
          this.managment = true
        }
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },
    /**
     * Hide success message dialog.
     */
    close (event) {
      this.dialogSuccess = false
    },
    /*
    Handles a change on the file upload
    */
    handleFileUpload () {
      this.formData = new FormData()
      this.formData.append('file', this.fileModel)
      this.formData.append('folder_id', this.$route.params.id)
      this.formData.append('confidential', false)
      this.formData.append('available', this.employeeCheckbox)
    },

    /**
     * POST request to submit the file to the server
     */
    submitFile (event) {
      let aux = ''
      if (this.$auth.user.role.name === 'CEO' || this.$auth.user.role.name === 'ADMIN' || this.$auth.user.role.name === 'DEPARTMENT') {
        aux = 'http://212.227.210.204:8765/upload_file/' + this.$route.params.id
      }
      if (this.$auth.user.role.name === 'EMPLOYEE') {
        aux = 'http://212.227.210.204:8765/employee/upload_file/' + this.$route.params.id
      }
      axios({
        url: aux,
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.$refs.form.reset()
        this.$refs.file.reset()
        this.employeeCheckbox = false
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
  color: #fafafa;
}
.myClass {
  background: #1e1e1e;
  color: snow;
}
.text {
  font-size: large;
}
</style>
