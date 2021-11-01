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
                <router-link to="/files" class="router">
                  {{ $t('folders') }}
                </router-link>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
      <hr>
      <hr>
      <v-row>
        <v-container>
          <input id="checkbox" v-model="checked" type="checkbox">
          <label class="text">{{ $t('confidential') }}</label>
        </v-container>
      </v-row>
      <hr>
      <!--      <v-row>-->
      <!--        <input type="checkbox" id="employeeCheckbox" v-model="employeeCheckbox">-->
      <!--        <label>Available for employee</label>-->
      <!--      </v-row>-->
      <hr>
      <!--    <v-select-->
      <!--      ref="department"-->
      <!--      v-model="selectDepartment"-->
      <!--      :items="departments.map(el => (el.name + ' ' + el.city.name))"-->
      <!--      :rules="[v => !!v || 'Item is required']"-->
      <!--      label="Department"-->
      <!--      @change="getFolders"-->
      <!--      required-->
      <!--    />-->
      <!--      <input ref="file" type="file" @change="handleFileUpload()" class="form-control" required>-->
      <!--      <button v-on:click="submitFile">Submit</button>-->
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
      checked: false,
      employeeCheckbox: false
    }
  },
  watch: {
    dialogSuccess (val) {
      val || this.close()
    }
  },
  methods: {
    /**
     * Hide success message dialog.
     */
    close (event) {
      this.dialogSuccess = false
      this.$router.back()
    },

    /*
      Handles a change on the file upload
    */
    handleFileUpload () {
      this.formData = new FormData()
      this.formData.append('file', this.fileModel)
      this.formData.append('folder_id', this.$route.params.id)
      this.formData.append('confidential', this.checked)
      this.formData.append('available', this.employeeCheckbox)
    },

    /**
     * POST request to submit the file to the server
    */
    submitFile (event) {
      axios({
        url: 'http://212.227.210.204:8765/upload_file/' + this.$route.params.id,
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
        this.checked = false
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
.myClass {
  background: #1e1e1e;
  color: snow;
}
.router {
  color: snow;
}
.text {
  font-size: large;
}
</style>
