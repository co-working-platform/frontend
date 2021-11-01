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
          <label class="title">My files</label>
        </v-container>
        <v-toolbar id="searchBar">
          <input v-model="lookup" type="text" placeholder="Search folder" class="Search">
        </v-toolbar>
      </v-toolbar>
      <v-list
        v-for="file in filteredFiles"
        :key="file.id"
      >
        <v-container>
          <v-row>
            <v-col
              align-self="center"
            >
              <label v-text="file.name" />
            </v-col>
            <v-col
              class="text-left"
            >
              <v-container>
                <v-row>
                  <label class="title" v-text="file.user.employee.name" />
                </v-row>
                <v-row>
                  <label class="subTitle" v-text="file.user.username" />
                </v-row>
              </v-container>
            </v-col>
            <v-col
              class="text-right"
              align-self="center"
            >
              <v-btn @click="downloadFile(file.url, file.name)">
                <v-icon color="grey lighten-1">
                  mdi-download
                </v-icon>
              </v-btn>
              <v-btn
                v-if="notEmployee"
                @click="deleteFile(file.url, file.name)"
              >
                <v-icon color="grey lighten-1">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-list>
      <v-btn>
        <router-link :to="`/uploadFileEmployee/${ $route.params.id }`" class="router">
          Upload file
        </router-link>
      </v-btn>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to delete this file?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDelete">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            Success!
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeSuccess">
              Close
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      fileList: [],
      lookup: '',
      dialogDelete: false,
      dialogSuccess: false,
      url_to_delete: '',
      notEmployee: false
    }
  },
  computed: {
    filteredFiles () {
      return this.fileList.filter((d) => {
        return d.name.match(this.lookup)
      })
    }
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogSuccess (val) {
      val || this.closeSuccess()
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.getAllFiles()
    this.checkUser()
  },
  methods: {
    /**
     * Check if the authenticated user is allowed to delete file.
     */
    checkUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const user = response.data
        if (user.role.name === 'ADMIN' || user.role.name === 'CEO' || user.role.name === 'DEPARTMENT') {
          this.notEmployee = true
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
    closeSuccess () {
      this.dialogDelete = false
      this.dialogSuccess = false
    },

    /**
     * Hide delete file dialog.
     */
    closeDelete () {
      this.dialogDelete = false
      this.getAllFiles()
    },

    /**
     * Download file
     * @param url of the file that needs to be download
     * @param title of the file that needs to be download
     */
    downloadFile (url, title) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },

    /**
     *  GET request to obtain a list with all the files from a specified folder.
     */
    getAllFiles () {
      axios.get('http://212.227.210.204:8765/files/' + this.$route.params.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        if (this.notEmployee === true) {
          this.fileList = response.data
        } else {
          const aux = response.data
          aux.forEach((el) => {
            if (el.available === true) {
              this.fileList.push(el)
            }
          })
        }
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * DELETE request to delete a file.
     */
    deleteItemConfirm () {
      const fileId = this.url_to_delete.split('http://212.227.210.204:8765/file/')[1]
      axios({
        url: 'http://212.227.210.204:8765/delete_file/' + fileId,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.closeDelete()
        this.dialogSuccess = true
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for delete file button.
     * @param urlFile of the file to be deleted
     * @param name of the file to be deleted
     */
    deleteFile (urlFile, name) {
      this.url_to_delete = urlFile
      this.dialogDelete = true
    }
  }
}
</script>

<style scoped>

</style>
