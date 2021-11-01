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
          <label class="title">{{ $t('myFolders') }}</label>
        </v-container>
        <v-toolbar id="searchBar" elevation="0">
          <v-icon class="mr-2">
            mdi-magnify
          </v-icon>
          <input v-model="lookup" type="text" :placeholder="$t('searchFolder')">
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
                <v-btn
                  v-if="admin"
                  color="white"
                  @click="moveFolder(folder)"
                >
                  <v-icon>
                    mdi-folder-move
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn class="ml-2 mr-2" color="white" @click="deleteFolder(folder.id)">
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
      <hr>
      <v-btn
        class="rounded-0"
        color="#000000"
        large
        dark
        @click="createFolder"
      >
        {{ $t('createFolder') }}
      </v-btn>
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('success') }}
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
      <v-dialog
        v-if="admin"
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
                      v-model="selectedDepartment"
                      :items="items"
                      :rules="[v => !!v || 'Item is required']"
                      :label="$t('department')"
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
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      folderName: '',
      dialogAddFolder: false,
      user: null,
      allFolders: [],
      folderList: [],
      dialogDeleteFolder: false,
      dialogSuccess: false,
      auxFolder: '',
      dialogRenameFolder: false,
      lookup: '',
      updatedFolder: '',
      items: [],
      dialogMoveDepartment: false,
      selectedDepartment: '',
      current: '',
      allDepartments: [],
      admin: false
    }
  },
  async fetch () {
    await this.getAllFolders()
  },
  computed: {
    filteredFolders () {
      return this.folderList.filter((d) => {
        return d.name.toLowerCase().match(this.lookup.toLowerCase())
      })
    }
  },
  watch: {
    dialogAddFolder (val) {
      val || this.closeAddFolder()
    },
    dialogMoveDepartment (val) {
      val || this.closeEdit()
    },
    dialogSuccess (val) {
      val || this.close()
    },
    dialogDeleteFolder (val) {
      val || this.closeDeleteFolder()
    },
    dialogRenameFolder (val) {
      val || this.closeRenameFolder()
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.getUser()
    if (this.$auth.user.role.name === 'CEO') {
      this.isCeo = true
    }
    localStorage.setItem('dep_id', this.$route.params.id)
  },
  methods: {
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
        if (this.user.role.name === 'CEO' || this.user.role.name === 'ADMIN') {
          this.admin = true
        }
        this.getAllFolders()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Get request to obtain a list containing the base folders.
     * Folders are filtered on department
     */
    getAllFolders () {
      let aux = ''
      if (this.user.role.name === 'CEO') {
        aux = 'http://212.227.210.204:8765/ceo/folders/' + this.user.employee.department.city.id
      }
      if (this.user.role.name === 'ADMIN') {
        aux = 'http://212.227.210.204:8765/admin/folders'
      }
      if (this.user.role.name === 'DEPARTMENT') {
        aux = 'http://212.227.210.204:8765/department/folders'
      }
      axios({
        url: aux,
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allFolders = response.data
        this.allFolders.forEach((el) => {
          if (el.department.id === parseInt(this.$route.params.id)) {
            this.folderList.push(el)
          }
        })
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
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
     * @param id Folder that needs to be ranamed
     */
    renameFolder (folder) {
      this.dialogRenameFolder = true
      this.updatedFolder = folder.name
      this.auxFolder = folder
    },

    /**
     * Hide rename folder dialog
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
      axios({
        url: 'http://212.227.210.204:8765/update_base_folder',
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
     * Hide success dialog
     */
    close (event) {
      this.dialogSuccess = false
      window.location.reload()
    },

    /**
     * Get request to obtain a list containing the cities.
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
     * Event for move folder button
     * @param id Folder that needs to be moved.
     */
    moveFolder (folder) {
      this.current = folder
      let aux = ''
      if (this.user.role.name === 'CEO') {
        aux = 'http://212.227.210.204:8765/departments'
      }
      if (this.user.role.name === 'ADMIN') {
        aux = 'http://212.227.210.204:8765/departments/' + this.user.employee.department.city.id
      }
      axios({
        url: aux,
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const aux = response.data
        aux.forEach((el) => {
          if (el.name !== 'CeoDepartment') {
            this.allDepartments.push(el)
          }
        })
        this.allDepartments.forEach((el) => {
          this.items.push(el.name + '   ' + el.city.name)
        })
        this.dialogMoveDepartment = true
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * PUT request to edit a folder.
     */
    editDepartmentConfirmation () {
      let id = 0
      this.allDepartments.forEach((el) => {
        if (el.name + '   ' + el.city.name === this.selectedDepartment) {
          id = el.id
        }
      })
      this.formData = new FormData()
      this.formData.append('id', this.current.id)
      this.formData.append('name', this.current.name)
      this.formData.append('dep_id', id)
      axios({
        url: 'http://212.227.210.204:8765/update_base_folder',
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
    },

    /**
     * Hide move folder dialog.
     */
    closeEdit () {
      this.dialogMoveDepartment = false
      this.allDepartments = []
    },

    /**
     * Hide add folder dialog.
     */
    closeAddFolder () {
      this.dialogAddFolder = false
      this.folderName = ''
    },

    /**
     * POST request to add a new folder.
     */
    addFolderConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.folderName)
      this.formData.append('dep_id', this.$route.params.id)
      axios({
        url: 'http://212.227.210.204:8765/create_base_folder',
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
     * Event for create folder button
     */
    createFolder () {
      this.dialogAddFolder = true
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
