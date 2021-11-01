<template>
  <v-container v-if="$fetchState.pending">
    <v-skeleton-loader
      type="card"
    />
  </v-container>
  <v-container
    v-else
    class="mx-auto"
  >
    <v-form ref="form">
      <v-toolbar>
        <v-container>
          <label class="title">{{ $t('mySubFolders') }}</label>
        </v-container>
        <v-toolbar id="searchBar" elevation="0">
          <v-icon class="mr-2">
            mdi-magnify
          </v-icon>
          <input v-model="lookupFolders" type="text" :placeholder="$t('search')">
        </v-toolbar>
      </v-toolbar>
      <hr>
      <v-list>
        <v-list-item
          v-for="folder in filteredFolders"
          id="folderList"
          :key="folder.id"
        >
          <v-list-item-avatar>
            <v-icon
              class="grey lighten-1"
              dark
              @click="$router.push({ path: `/folder/${ folder.id }` })"
            >
              mdi-folder
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="folder.name" />
          </v-list-item-content>
          <v-list-item-action>
            <v-row>
              <v-col>
                <v-btn color="white" @click="moveFolder(folder)">
                  <v-icon>
                    mdi-folder-move
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="white" @click="deleteFolder(folder.id)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="white" @click="renameFolder(folder)">
                  <v-icon>
                    mdi-rename-box
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-dialog v-model="dialogDeleteFolder" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('areYouSureYouWantToDeleteIt') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDeleteFolder">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteFolderConfirm">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogRenameFolder" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('renameFolder') }}
          </v-card-title>
          <v-card-text>
            <input v-model="updatedFolder" type="text" :placeholder="$t('folderName')" class="update">
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeRenameFolder">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="renameFolderConfirm">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <hr>
      <v-row>
        <v-col class="text-left">
          <v-btn
            class="rounded-0"
            color="#000000"
            large
            dark
            @click="createFolder"
          >
            {{ $t('createFolder') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-toolbar class="mb-5">
        <v-container>
          <label class="title">{{ $t('myFiles') }}</label>
        </v-container>
        <v-toolbar id="searchBar" elevation="0">
          <v-icon class="mr-2">
            mdi-magnify
          </v-icon>
          <input v-model="lookupFiles" type="text" :placeholder="$t('search')">
        </v-toolbar>
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="file in filteredFiles"
          :key="file.id"
        >
          <v-list-item-avatar>
            <v-icon
              class="grey lighten-1"
              dark
            >
              mdi-file
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="file.name" />
            <v-list-item-subtitle v-text="file.user.employee.name" />
            <v-list-item-subtitle v-text="file.user.username" />
          </v-list-item-content>
          <v-list-item-action>
            <v-row>
              <v-col>
                <v-btn color="white" @click="downloadFile(file.url, file.name, file.confidential, file.available)">
                  <v-icon>
                    mdi-download
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="white" @click="deleteFile(file.url, file.name, file.confidential)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="white" @click="moveFile(file.url, file.confidential)">
                  <v-icon>
                    mdi-file-move
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('areYouSureYouWantToDeleteThisFile') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeDelete">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <hr>
      <v-row>
        <v-col class="text-left">
          <v-btn
            class="rounded-0 mr-5"
            color="#000000"
            large
            dark
            :to="`/uploadFile/${ $route.params.id }`"
          >
            {{ $t('uploadAFile') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialogMoveDepartment"
        max-width="500px"
      >
        <v-form ref="formMoveDepartment">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-select
                      v-model="selectedFolder"
                      :items="items"
                      :rules="[v => !!v || 'Item is required']"
                      :label="$t('folder')"
                      required
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeEdit">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="editDepartmentConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogAddFolder" max-width="500px">
        <v-form ref="formAddFolder">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="folderName" type="text" :placeholder="$t('folderName')" class="classInput">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAddFolder">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addFolderConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('success') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeFailure">
              {{ $t('close') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogFailure" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('youAreNotAllowedToDoThisOperation') }}
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
      <v-dialog v-model="dialogPinCode" max-width="500px">
        <v-form ref="formPinCode">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input
                      v-model="inputPin"
                      oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                      type="number"
                      placeholder="Pin code"
                      class="classInput"
                      maxlength="4"
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closePinCode">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="confirmPinCode">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      folderList: [],
      fileList: [],
      dialogDelete: false,
      dialogSuccess: false,
      url_to_delete: '',
      dialogDeleteFolder: false,
      deletedFolder: 0,
      dialogRenameFolder: false,
      updatedFolder: true,
      auxFolder: '',
      formData: null,
      lookupFolders: '',
      lookupFiles: '',
      allFiles: [],
      isCeo: false,
      cities: [],
      selectedCity: '',
      items: [],
      dialogMoveDepartment: false,
      allFolders: [],
      selectedFolder: '',
      dialogAddFolder: false,
      folderName: '',
      type: 0,
      fileId: 0,
      dialogPinCode: false,
      inputPin: '',
      dialogFailure: false,
      confidential: false,
      helperDownloadUrl: '',
      helperDownloadTitle: '',
      helperMoveFile: ''
    }
  },
  async fetch () {
    await this.getFolders()
  },
  computed: {
    filteredFolders () {
      return this.folderList.filter((d) => {
        return d.name.toLowerCase().match(this.lookupFolders.toLowerCase())
      })
    },
    filteredFiles () {
      return this.fileList.filter((d) => {
        return d.name.toLowerCase().match(this.lookupFiles.toLowerCase())
      })
    }
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogSuccess (val) {
      val || this.close()
    },
    dialogDeleteFolder (val) {
      val || this.closeDeleteFolder()
    },
    dialogRenameFolder (val) {
      val || this.closeRenameFolder()
    },
    dialogMoveDepartment (val) {
      val || this.closeEdit()
    },
    dialogAddFolder (val) {
      val || this.closeAddFolder()
    },
    dialogPinCode (val) {
      val || this.closePinCode()
    },
    dialogFailure (val) {
      val || this.closeFailure()
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.getUser()
    this.getFolders()
  },
  methods: {
    /**
     * Event for move folder button
     * @param folder Folder that need to be moved.
     */
    moveFolder (folder) {
      this.current = folder
      axios({
        url: 'http://212.227.210.204:8765/folders',
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allFolders = response.data
        if (this.user.role.name === 'CEO') {
          this.allFolders.forEach((el) => {
            this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
          })
        }
        if (this.user.role.name === 'ADMIN') {
          this.allFolders.forEach((el) => {
            if (el.department.city.id === this.user.employee.department.city.id) {
              this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
            }
          })
        }
        if (this.user.role.name === 'DEPARTMENT') {
          this.allFolders.forEach((el) => {
            if (el.department.id === this.user.employee.department.id) {
              this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
            }
          })
        }
        this.type = 1
        this.dialogMoveDepartment = true
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for add folder button
     */
    createFolder () {
      this.dialogAddFolder = true
    },

    /**
     * Hide move folder dialog
     */
    closeEdit () {
      this.dialogMoveDepartment = false
    },

    /**
     * PUT request to move a folder if type is 1, otherwise move a file.
     */
    moveRequest () {
      if (this.type === 1) {
        this.formData = new FormData()
        this.formData.append('id', this.current.id)
        this.formData.append('name', this.current.name)
        this.formData.append('dep_id', this.idDep)
        this.formData.append('folder_id', this.idFolder)
        axios({
          url: 'http://212.227.210.204:8765/update_sub_folder',
          method: 'PUT',
          data: this.formData,
          headers: {
            Authorization: this.$auth.getToken('local'),
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.dialogSuccess = true
          this.closeEdit()
        }).catch((error) => {
          window.alert('An error occurred. Please try again!')
          const response = error.response
          console.log(JSON.stringify(response.data.errors))
        })
      } else {
        this.formData = new FormData()
        this.formData.append('folder_id', this.idFolder)
        axios({
          url: 'http://212.227.210.204:8765/update_file/' + this.fileId,
          method: 'PUT',
          data: this.formData,
          headers: {
            Authorization: this.$auth.getToken('local'),
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.dialogSuccess = true
          this.closeEdit()
        }).catch((error) => {
          window.alert('An error occurred. Please try again!')
          const response = error.response
          console.log(JSON.stringify(response.data.errors))
        })
      }
    },

    /**
     * Get department and folder name to move a sub-folder.
     */
    editDepartmentConfirmation () {
      this.allFolders.forEach((el) => {
        if ((el.department.name + '   ' + el.department.city.name + ' : ' + el.name) === this.selectedFolder) {
          this.idFolder = el.id
        }
      })
      if (this.user.role.name === 'DEPARTMENT') {
        this.idDep = this.user.employee.department.id
        this.moveRequest()
      } else {
        let aux = ''
        if (this.user.role.name === 'CEO') {
          aux = 'http://212.227.210.204:8765/departments'
        }
        if (this.user.role.name === 'ADMIN') {
          aux = 'http://212.227.210.204:8765/departments/' + this.user.employee.department.city.id
        }
        axios.get(aux, {
          headers: {
            Authorization: this.$auth.getToken('local')
          }
        }).then((response) => {
          this.departmentList = response.data
          this.departmentList.forEach((el) => {
            if (this.selectedFolder.split(' :')[0] === (el.name + '   ' + el.city.name)) {
              this.idDep = el.id
            }
          })
          this.moveRequest()
        }).catch((error) => {
          window.alert('An error occurred. Please try again!')
          const response = error.response
          console.log(JSON.stringify(response.data.errors))
        })
      }
    },

    /**
     * Hide delete file dialog.
     */
    closeDelete () {
      this.dialogDelete = false
      this.$refs.form.reset()
    },

    /**
     * If a file is confidential, request pin, otherwise download file.
     * @param url of the file that needs to be download
     * @param title of the file that needs to be download
     * @param confidential Confidentiality status of the file that needs to be download
     * @param available Availability for employees status of the file that needs to be download
     */
    downloadFile (url, title, confidential, available) {
      if (confidential === false) {
        this.confirmDownload(url, title)
      } else {
        this.helperDownloadUrl = url
        this.helperDownloadTitle = title
        this.dialogPinCode = true
        this.typeDelete = 1
      }
    },

    /**
     * Download file
     * @param url of the file that needs to be download
     * @param title of the file that needs to be download
     */
    confirmDownload (url, title) {
      axios.get(url, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const link = document.createElement('a')
        const data = response.data
        const blob = new Blob([data])
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', title)
        document.body.appendChild(link)
        link.click()
      }).catch((error) => {
        const response = error.response
        window.alert(JSON.stringify(response.data.errors))
      })
    },

    /**
     *  GET request to obtain a list with all the folders from database.
     */
    getFolders () {
      axios({
        url: 'http://212.227.210.204:8765/folders/' + this.$route.params.id,
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.folderList = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Get request to obtain the authenticated user
     */
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.user = response.data
        if (this.user.role.name === 'CEO') {
          this.isCeo = true
        }
        this.getAllFiles()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     *  GET request to obtain a list with all the files, depending on the user role.
     */
    getAllFiles () {
      let aux = ''
      if (this.user.role.name === 'CEO') {
        aux = 'http://212.227.210.204:8765/ceo/files/' + this.user.employee.department.city.id
      }
      if (this.user.role.name === 'ADMIN') {
        aux = 'http://212.227.210.204:8765/admin/files'
      }
      if (this.user.role.name === 'DEPARTMENT') {
        aux = 'http://212.227.210.204:8765/department/files'
      }
      axios.get(aux, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allFiles = response.data
        this.allFiles.forEach((el) => {
          if (el.folder.id === parseInt(this.$route.params.id)) {
            this.fileList.push(el)
          }
        })
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
     * Event for delete file button. If the file is confidential, there must be entered a pin code.
     * @param urlFile of the file that needs to be deleted
     * @param name of the file that needs to be deleted
     * @param confidential Confidential status of the file that needs to be deleted
     */
    deleteFile (urlFile, name, confidential) {
      this.url_to_delete = urlFile
      this.confidential = confidential
      if (this.confidential === true) {
        this.dialogPinCode = true
        this.typeDelete = 2
      } else {
        this.dialogDelete = true
      }
    },

    /**
     * Hide success dialog.
     * @param event
     */
    close (event) {
      this.dialogSuccess = false
      window.location.reload()
    },

    helpMoveFile (url) {
      this.fileId = this.helperMoveFile.split('http://212.227.210.204:8765/file/')[1]
      axios({
        url: 'http://212.227.210.204:8765/folders',
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allFolders = response.data
        if (this.user.role.name === 'CEO') {
          this.allFolders.forEach((el) => {
            this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
          })
        }
        if (this.user.role.name === 'ADMIN') {
          this.allFolders.forEach((el) => {
            if (el.department.city.id === this.user.employee.department.city.id) {
              this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
            }
          })
        }
        if (this.user.role.name === 'DEPARTMENT') {
          this.allFolders.forEach((el) => {
            if (el.department.city.id === this.user.employee.department.city.id && el.department.id === this.user.employee.department.id) {
              this.items.push(el.department.name + '   ' + el.department.city.name + ' : ' + el.name)
            }
          })
        }
        this.type = 2
        this.dialogMoveDepartment = true
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
   * Event for move file button.
   * @param url of the file that needs to be moved.
   */
    moveFile (url, confidential) {
      this.helperMoveFile = url
      if (confidential === false) {
        this.helpMoveFile()
      } else {
        this.typeDelete = 3
        this.dialogPinCode = true
      }
    },

    /**
     * Event for delete folder button
     * @param id of the folder that needs to be deleted.
     */
    deleteFolder (id) {
      this.dialogDeleteFolder = true
      this.deletedFolder = id
    },

    /**
     * Hide delete folder dialog
     */
    closeDeleteFolder () {
      this.dialogDeleteFolder = false
    },

    /**
     * DELETE request to delete a folder.
     */
    deleteFolderConfirm () {
      axios({
        url: 'http://212.227.210.204:8765/delete_folder/' + this.deletedFolder,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.dialogDeleteFolder = false
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for rename folder button
     * @param folder that needs to be deleted.
     */
    renameFolder (folder) {
      this.dialogRenameFolder = true
      this.updatedFolder = folder.name
      this.auxFolder = folder
    },

    /**
     * Hide rename folder dialog.
     */
    closeRenameFolder () {
      this.dialogRenameFolder = false
      this.updatedFolder = ''
    },

    /**
     * PUT request to rename a folder.
     */
    renameFolderConfirm () {
      this.formData = new FormData()
      this.formData.append('id', this.auxFolder.id)
      this.formData.append('name', this.updatedFolder)
      this.formData.append('dep_id', this.auxFolder.department.id)
      this.formData.append('folder_id', this.auxFolder.parent.id)
      axios({
        url: 'http://212.227.210.204:8765/update_sub_folder',
        method: 'PUT',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.updatedFolder = ''
        this.dialogRenameFolder = false
        window.location.reload()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Hide add folder dialog
     */
    closeAddFolder () {
      this.dialogAddFolder = false
      this.folderName = ''
    },

    /**
     * POST request to create a folder.
     */
    addFolderConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.folderName)
      this.formData.append('dep_id', localStorage.getItem('dep_id'))
      this.formData.append('folder_id', this.$route.params.id)
      axios({
        url: 'http://212.227.210.204:8765/create_sub_folder',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddFolder()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Hide failure message dialog.
     */
    closeFailure () {
      this.dialogFailure = false
      window.location.reload()
    },

    /**
     * POST method to check the entered pin code for confidental files.
     */
    confirmPinCode () {
      this.formData = new FormData()
      this.formData.append('password', this.inputPin)
      this.formData.append('city_id', this.user.employee.department.city.id)
      axios({
        url: 'http://212.227.210.204:8765/department/check_password',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        if (response.data === true) {
          if (this.typeDelete === 1) {
            this.confirmDownload(this.helperDownloadUrl, this.helperDownloadTitle)
          }
          if (this.typeDelete === 2) {
            this.dialogDelete = true
          }
          if (this.typeDelete === 3) {
            this.helpMoveFile()
          }
        } else {
          this.dialogFailure = true
        }
        this.closePinCode()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Hide pin code dialog.
     */
    closePinCode () {
      this.dialogPinCode = false
      this.inputPin = ''
    }
  }
}
</script>

<style scoped>
.update {
  border-color: grey;
  border-style: solid;
}
.classInput {
  border-color: grey;
  border-style: solid;
}
</style>
