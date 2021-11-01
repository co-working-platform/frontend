<template>
  <v-container>
    <v-card elevation="3">
      <v-data-table
        ref="myTable"
        :headers="headers"
        :items="employees"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        sort-by="department"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar elevation="1" class="mb-3">
            <v-toolbar-title>{{ $t('employees') }}</v-toolbar-title>

            <v-spacer />

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('search')"
              single-line
              hide-details
            />

            <v-spacer />

            <download-csv
              v-if="admin"
              :data="employeesJSON"
              :name="dataFile"
              :labels="labels"
              :fields="fields"
              @export-finished="exported"
            >
              <button class="button">
                {{ $t('download') }}
              </button>
            </download-csv>

            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ $t('editEmployee') }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.firstname"
                          :label="$t('employeeFirstName')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.lastname"
                          :label="$t('employeeLastName')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.salary"
                          :label="$t('salary')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.employmentTime"
                          :label="$t('employeePeriodOfEmployment')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.jobPosition"
                          :label="$t('jobPosition')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.contact.phoneNumber"
                          :label="$t('phoneNumber')"
                          :rules="[required($t('phoneMumber')), numberFormat()]"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.contact.email"
                          label="Email"
                          :rules="[required('email'), emailFormat()]"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.contact.address"
                          :label="$t('address')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="userInfo.description"
                          label="Description"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          ref="department"
                          v-model="userInfo.department.name"
                          :items="departments.map(el => el.name)"
                          :rules="[v => !!v || $t('itemIsRequired')]"
                          :label="$t('departmentName')"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          ref="department"
                          v-model="userInfo.department.city.name"
                          :items="cities"
                          :rules="[v => !!v || $t('itemIsRequired')]"
                          :label="$t('departmentCity')"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          ref="contract"
                          v-model="userInfo.contractType"
                          :items="contractTypes"
                          :rules="[v => !!v || $t('itemIsRequired')]"
                          :label="$t('contractType')"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          ref="gender"
                          v-model="userInfo.gender"
                          :items="genders"
                          :rules="[v => !!v || $t('itemIsRequired')]"
                          :label="$t('gender')"
                          required
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    {{ $t('save') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  {{ $t('areYouSureYouWantToDeleteThisAccount') }}
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
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editEmployee(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="removeEmployee(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            small
            @click="addFolder(item)"
          >
            mdi-folder
          </v-icon>
        </template>

        <!--      <template v-slot:[`item.avatar`]="{ item }">-->
        <!--        <v-list-item-avatar>-->
        <!--          <v-img :src="item.avatar"></v-img>-->
        <!--        </v-list-item-avatar>-->
        <!--      </template>-->

        <template #expanded-item="{ item }">
          <td :colspan="headers.length">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>More Info</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('jobDescription') }}: {{ item.description }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t('address') }}: {{ item.contact.address }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Email: {{ item.contact.email }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t('phoneNumber') }}: {{ item.contact.phoneNumber }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-btn
                v-if="admin"
                @click="openPwdGeneration(item)"
              >
                {{ $t('generateNewPasswordFor') }} {{ item.firstname + ' ' + item.lastname }}
              </v-btn>
              <v-dialog v-model="dialogPopUp" max-width="500px">
                <v-card>
                  <v-card-title class="headline">
                    {{ $t('pressTheFollowingButtonToCopyThePassword') }}
                  </v-card-title>
                  <v-spacer />
                  <v-text-field ref="textToCopy" v-model="pwd" label="New Password" outlined readonly />
                  <v-spacer />
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="closePopUp">
                      {{ $t('cancel') }}
                    </v-btn>
                    <v-container>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click.stop.prevent="copy"
                      >
                        {{ $t('copy') }}
                      </v-btn>
                    </v-container>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <br>
    <v-card elevation="3">
      <v-toolbar elevation="1">
        <v-toolbar-title>
          {{ $t('createNewEmployee') }}
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-row>
          <v-col cols="4">
            <v-text-field
              ref="name"
              v-model="userInfo.firstname"
              class="ml-5 mr-5"
              :label="$t('firstName')"
              :rules="[required($t('firstName'))]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              ref="name"
              v-model="userInfo.lastname"
              class="ml-5 mr-5"
              :label="$t('lastName')"
              :rules="[required($t('lastName'))]"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="role"
              v-model="role"
              class="ml-5 mr-5"
              :items="roles.map(el => el.name)"
              :rules="[v => !!v || $t('itemIsRequired')]"
              label="Role"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-select
              ref="department"
              v-model="userInfo.department.name"
              class="ml-5 mr-5"
              :items="departments.map(el => el.name)"
              :rules="[v => !!v || $t('itemIsRequired')]"
              :label="$t('departmentName')"
              required
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="department"
              v-model="userInfo.department.city.name"
              class="ml-5 mr-5"
              :items="departments.map(el => el.city.name)"
              :rules="[v => !!v || $t('itemIsRequired')]"
              :label="$t('departmentCity')"
              required
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="gender"
              v-model="userInfo.gender"
              class="ml-5 mr-5"
              :items="genders"
              :rules="[v => !!v || $t('itemIsRequired')]"
              :label="$t('gender')"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              ref="period"
              v-model="userInfo.salary"
              class="ml-5 mr-5"
              :label="$t('salary')"
              :rules="[required($t('salary'))]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.jobPosition"
              class="ml-5 mr-5"
              :label="$t('jobPosition')"
              :rules="[required($t('jobPosition'))]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.employmentTime"
              class="ml-5 mr-5"
              :label="$t('employeePeriodOfEmployment')"
              :rules="[required($t('employeePeriodOfEmployment'))]"
            />
          </v-col>
        <!--      <v-text-field-->
        <!--        v-model="userInfo.avatar"-->
        <!--        label="Face ID"-->
        <!--        :rules="[required('item__avatar')]"-->
        <!--      />-->
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.contact.address"
              class="ml-5 mr-5"
              :label="$t('address')"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.contact.email"
              class="ml-5 mr-5"
              label="Email"
              :rules="[required('email'), emailFormat()]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.contact.phoneNumber"
              class="ml-5 mr-5"
              :label="$t('phoneNumber')"
              :rules="[required($t('phoneNumber')), numberFormat()]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="userInfo.description"
              class="ml-5 mr-5"
              :label="$t('jobDescription')"
              :rules="[required($t('jobDescription'))]"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="contract"
              v-model="userInfo.contractType"
              class="ml-5 mr-5"
              :items="contractTypes"
              :rules="[v => !!v || $t('itemIsRequired')]"
              :label="$t('contractType')"
              required
            />
          </v-col>
        </v-row>

        <v-checkbox
          v-model="checkbox"
          class="ml-5"
          :rules="[v => !!v || $t('mustAgreeToContinue')]"
          :label="$t('isInformationCorrect')"
          required
        />

        <v-btn
          class="ml-5 mb-5"
          color="success"
          :disabled="!valid"
          @click="addEmployee()"
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
      <v-dialog v-model="dialogSuccess" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('success') }}
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
      <v-dialog v-model="dialogNotAuthorized" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('notAuthorizedForThisOperation') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeUnauthorized">
              {{ $t('close') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogAddFolder" max-width="500px">
        <v-form ref="formAddFolder">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="newFolder" type="text" :placeholder="$t('folderName')" class="addFolder">
                  </v-col>
                  <v-col>
                    <v-select
                      ref="newDepartment"
                      v-model="department"
                      :items="departments.map(el => (el.name + ' ' + el.city.name))"
                      :rules="[v => !!v || $t('itemIsRequired')]"
                      :label="$t('department')"
                      required
                    />
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
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import validations from '@/utils/validations'
import JsonCSV from 'vue-json-csv'

export default {
  components: {
    'download-csv': JsonCSV
  },
  data: () => ({
    dialogNotAuthorized: false,
    currentEmployeeId: 0,
    newFolder: '',
    dialogAddFolder: false,
    dialogSuccess: false,
    department: '',
    createdFolder: '',
    role: '',
    roles: [],
    pwd: '',
    search: '',
    expanded: [],
    singleExpand: false,
    dialog: false,
    dialogDelete: false,
    dialogPopUp: false,
    valid: true,
    showPassword: true,
    formData: null,
    dataFile: 'my_export.csv',
    labels: {
      firstname: 'First Name',
      lastname: 'Last Name',
      department: 'Department',
      gender: 'Gender',
      salary: 'Salary',
      jobPosition: 'Job Position',
      contractType: 'Contract Type',
      address: 'Address',
      phoneNo: 'Phone Number',
      email: 'Email'
    },
    fields: ['firstname', 'lastname', 'department', 'gender', 'salary', 'jobPosition', 'contractType',
      'address', 'phoneNo', 'email'],
    isExported: false,
    employeesJSON: [],
    employees: [],
    editedIndex: -1,
    headers: [
      {
        text: 'First Name',
        align: 'start',
        value: 'firstname',
        groupable: false
      },
      { text: 'Last Name', value: 'lastname', align: 'right' },
      { text: 'Department', value: 'department.name', align: 'right' },
      { text: 'Gender', value: 'gender', align: 'right' },
      { text: 'Salary', value: 'salary', align: 'right' },
      { text: 'Job Position', value: 'jobPosition', align: 'right' },
      { text: 'Contract Type', value: 'contractType', align: 'right' },
      // { text: 'Avatar', value: 'avatar', align: 'right' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    userInfo: {
      id: '',
      firstname: '',
      lastname: '',
      jobPosition: '',
      description: '',
      salary: 0,
      contractType: '',
      employmentTime: 0,
      gender: '',
      contact: {
        id: '',
        address: '',
        phoneNumber: '',
        email: ''
      },
      department: {
        id: '',
        name: '',
        city: {
          id: '',
          name: ''
        }
      },
      folder: {
        id: '',
        name: '',
        department: {
          id: '',
          name: '',
          city: {
            id: '',
            name: ''
          }
        },
        base: true
      }
    },
    defaultItem: {
      id: '',
      firstname: '',
      lastname: '',
      jobPosition: '',
      description: '',
      salary: 0,
      contractType: '',
      employmentTime: 0,
      gender: '',
      contact: {
        id: '',
        address: '',
        phoneNumber: '',
        email: ''
      },
      department: {
        id: '',
        name: '',
        city: {
          id: '',
          name: ''
        }
      },
      folder: {
        id: '',
        name: '',
        department: {
          id: '',
          name: '',
          city: {
            id: '',
            name: ''
          }
        },
        base: true
      }
    },
    cities: [],
    contractTypes: [
      'Part-time employee',
      'Full-time employee'
    ],
    genders: [
      'Female',
      'Male',
      'Prefer not to say'
    ],
    allUsers: [],
    admin: false,
    departments: [],
    checkbox: false,
    ...validations
  }),

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogSuccess (val) {
      val || this.closeSuccess()
    },
    dialogAddFolder (val) {
      val || this.closeAddFolder()
    },
    dialogNotAuthorized (val) {
      val || this.closeUnauthorized()
    }
  },

  destroyed () {
    this.csvLabels = null
    this.csvData = null
  },

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.checkRole()
    this.getAllEmployees()
    this.getDepartments()
    this.getRoles()
    this.getAllUsers()
  },

  methods: {
    /**
     * Get request to the 'http://212.227.210.204:8765/department/users'
     * endpoint on backend to get all users regitered in the database.
     * */
    getAllUsers () {
      axios.get('http://212.227.210.204:8765/department/users', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allUsers = response.data
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Checks if the logged in user is an ADMIN or CEO
     * to see which features to hide or show depending on
     * the user role.
     * */
    checkRole () {
      if (this.$auth.user.role.name === 'CEO' || this.$auth.user.role.name === 'ADMIN') {
        this.admin = true
      }
    },

    /**
     * Generates new password for the selected employee from the listing.
     * Only the admin or ceo can change the password on the following endpoint:
     * 'http://212.227.210.204:8765/admin/generate_password'.
     * */
    openPwdGeneration (item) {
      this.formData = new FormData()
      this.formData.append('employee_id', item.id)
      axios({
        url: 'http://212.227.210.204:8765/admin/generate_password',
        method: 'PUT',
        data: this.formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.pwd = response.data
        this.dialogPopUp = true
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * This method is a helper to the user.
     * It copies the autogenerated password for the user
     * by the click of a button.
     * */
    copy () {
      const textToCopy = this.$refs.textToCopy.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
    },

    /**
     * modifies the value of isExported
     * when the data is exported.
     * */
    exported (event) {
      console.log(event)
      this.isExported = true
      setTimeout(() => {
        this.isExported = false
      }, 3 * 1000)
    },

    /**
     * Gets all the employees from the database through
     * a GET request to the following endpoint:
     * 'http://212.227.210.204:8765/department/employees'.
     * As well as, sets the employee variable used for the export of the data.
     * */
    getAllEmployees () {
      axios.get('http://212.227.210.204:8765/admin/employees', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      })
        .then((response) => {
          const aux = response.data
          aux.forEach((el) => {
            if (el.department.city.id === this.$auth.user.employee.department.city.id) {
              this.employees.push(el)
            }
          })
          this.employees.forEach((element) => {
            const employee = {
              firstname: element.firstname,
              lastname: element.lastname,
              department: element.department.name + ' ' + element.department.city.name,
              gender: element.gender,
              salary: element.salary.toString(),
              jobPosition: element.jobPosition,
              contractType: element.contractType,
              address: element.contact.address,
              phoneNo: element.contact.phoneNumber,
              email: element.contact.email
            }
            this.employeesJSON.push(employee)
          })
        })
        .catch(error => console.log(error))
    },

    /**
     * Gets all the roles available for employees in order for the user
     * to select a role for the newly created employee.
     * */
    getRoles () {
      axios.get('http://212.227.210.204:8765/department/roles', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.roles = response.data
      }).catch((error) => {
        const response = error.response
        console.log(response)
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Gets all the departments available in order for the user
     * to select a department for the newly created employee.
     * */
    getDepartments () {
      axios.get('http://212.227.210.204:8765/departments/' + this.$auth.user.employee.department.city.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const aux = response.data
        aux.forEach((el) => {
          if (el.name !== 'CeoDepartment') {
            this.departments.push(el)
          }
        })
        this.departments.forEach((element) => {
          this.cities.push(element.city.name)
        })
      }).catch((error) => {
        const response = error.response
        console.log(response)
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * This method creates a new employee in the database
     * through a POST request at the 'http://212.227.210.204:8765/department/create_employee'
     * endpoint.
     * */
    addEmployee () {
      this.departments.forEach((element) => {
        if (element.name === this.userInfo.department.name && element.city.name === this.userInfo.department.city.name) {
          this.userInfo.department.id = element.id
        }
      })
      const post = {
        firstname: this.userInfo.firstname,
        lastname: this.userInfo.lastname,
        jobPos: this.userInfo.jobPosition,
        description: this.userInfo.description,
        salary: this.userInfo.salary,
        contract: this.userInfo.contractType,
        empTime: this.userInfo.employmentTime,
        gender: this.userInfo.gender,
        address: this.userInfo.contact.address,
        phone: this.userInfo.contact.phoneNumber,
        email: this.userInfo.contact.email,
        dep_id: this.userInfo.department.id,
        role: this.role
      }
      this.formData = new FormData()
      this.formData.append('firstname', post.firstname)
      this.formData.append('lastname', post.lastname)
      this.formData.append('jobPos', post.jobPos)
      this.formData.append('description', post.description)
      this.formData.append('salary', post.salary)
      this.formData.append('contract', post.contract)
      this.formData.append('empTime', post.empTime)
      this.formData.append('gender', post.gender)
      this.formData.append('address', post.address)
      this.formData.append('phone', post.phone)
      this.formData.append('email', post.email)
      this.formData.append('dep_id', post.dep_id)
      this.formData.append('role', post.role)
      /*
          Make the request to the POST
        */
      axios({
        url: 'http://212.227.210.204:8765/admin/create_employee',
        method: 'POST',
        data: this.formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Opens the dialog with all the fields of an employee that can be modified.
     * @param item the employee selected
     */
    editEmployee (item) {
      let role = ''
      this.allUsers.forEach((el) => {
        if (el.employee.id === item.id) {
          role = el.role.name
        }
      })
      if (this.$auth.user.role.name === 'CEO') {
        this.userInfo = Object.assign(this.userInfo, item)
        this.dialog = true
      }
      if (this.$auth.user.role.name === 'ADMIN') {
        if (role !== 'CEO' && role !== 'ADMIN') {
          this.userInfo = Object.assign(this.userInfo, item)
          this.dialog = true
        } else {
          this.dialogNotAuthorized = true
        }
      }
      if (this.$auth.user.role.name === 'DEPARTMENT') {
        if (role === 'EMPLOYEE') {
          this.userInfo = Object.assign(this.userInfo, item)
          this.dialog = true
        } else {
          this.dialogNotAuthorized = true
        }
      }
    },

    /**
     * PUT method to edit the selected employee in the database.
     */
    save () {
      this.formData = new FormData()
      this.formData.append('id', this.userInfo.id)
      this.formData.append('firstname', this.userInfo.firstname)
      this.formData.append('lastname', this.userInfo.lastname)
      this.formData.append('jobPos', this.userInfo.jobPosition)
      this.formData.append('description', this.userInfo.description)
      this.formData.append('salary', this.userInfo.salary)
      this.formData.append('contract', this.userInfo.contractType)
      this.formData.append('empTime', this.userInfo.employmentTime)
      this.formData.append('gender', this.userInfo.gender)
      this.formData.append('address', this.userInfo.contact.address)
      this.formData.append('phone', this.userInfo.contact.phoneNumber)
      this.formData.append('email', this.userInfo.contact.email)
      this.formData.append('dep_id', this.userInfo.department.id)
      axios({
        url: 'http://212.227.210.204:8765/admin/update_employee',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: this.$auth.getToken('local')
        },
        data: this.formData
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Opens the delete dialog to make sure the user
     * really wants to proceed forward with the deletion.
     * @param x the employee selected
     */
    removeEmployee (x) {
      let role = ''
      this.allUsers.forEach((el) => {
        if (el.employee.id === x.id) {
          role = el.role.name
        }
      })
      if (this.$auth.user.role.name === 'CEO') {
        this.userInfo = Object.assign(this.userInfo, x)
        this.dialogDelete = true
      }
      if (this.$auth.user.role.name === 'ADMIN') {
        if (role !== 'CEO' && role !== 'ADMIN') {
          this.userInfo = Object.assign(this.userInfo, x)
          this.dialogDelete = true
        } else {
          this.dialogNotAuthorized = true
        }
      }
      if (this.$auth.user.role.name === 'DEPARTMENT') {
        if (role === 'EMPLOYEE') {
          this.userInfo = Object.assign(this.userInfo, x)
          this.dialogDelete = true
        } else {
          this.dialogNotAuthorized = true
        }
      }
    },

    /**
     * DELETE method to remove employee from the database.
     */
    deleteItemConfirm () {
      axios({
        url: 'http://212.227.210.204:8765/admin/delete_employee/' + this.userInfo.id.toString(),
        method: 'DELETE',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.closeDelete()
        window.location.reload()
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Closes the dialog.
     */
    close () {
      this.dialog = false
      this.resetForm()
    },

    /**
     * Closes the dialog.
     */
    closePopUp () {
      this.dialogPopUp = false
      this.resetForm()
    },

    /**
     * Closes the dialog.
     */
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.userInfo = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    /**
     * Closes the dialog.
     */
    closeUnauthorized () {
      this.dialogNotAuthorized = false
    },

    /**
     * Resets the fields of the form.
     * */
    resetForm () {
      this.$refs.form.reset()
    },

    /**
     * Closes the dialog.
     */
    closeAddFolder () {
      this.dialogAddFolder = false
      this.newFolder = ''
      this.department = ''
    },

    /**
     * If the employee has assigned a folder, this method redirects to the employee's folder, otherwise, a create folder dialog is opened.
     * @param item Selected employee
     */
    addFolder (item) {
      let role = ''
      this.allUsers.forEach((el) => {
        if (el.employee.id === item.id) {
          role = el.role.name
        }
      })
      if (this.$auth.user.role.name === 'CEO') {
        if (item.folder === null) {
          this.dialogAddFolder = true
          this.currentEmployeeId = item.id
        } else {
          this.$router.push('/employeeFolder/' + item.folder.id)
        }
      }
      if (this.$auth.user.role.name === 'ADMIN') {
        if (role !== 'CEO' && role !== 'ADMIN') {
          if (item.folder === null) {
            this.dialogAddFolder = true
            this.currentEmployeeId = item.id
          } else {
            this.$router.push('/employeeFolder/' + item.folder.id)
          }
        } else {
          this.dialogNotAuthorized = true
        }
      }
      if (this.$auth.user.role.name === 'DEPARTMENT') {
        if (role === 'EMPLOYEE') {
          if (item.folder === null) {
            this.dialogAddFolder = true
            this.currentEmployeeId = item.id
          } else {
            this.$router.push('/employeeFolder/' + item.folder.id)
          }
        } else {
          this.dialogNotAuthorized = true
        }
      }
    },

    /**
     * POST request to create a folder for an employee.
     */
    addFolderConfirmation () {
      let id = 0
      this.departments.forEach((el) => {
        if (el.name + ' ' + el.city.name) {
          id = el.id
        }
      })
      this.formData = new FormData()
      this.formData.append('name', this.newFolder)
      this.formData.append('dep_id', id)
      axios({
        url: 'http://212.227.210.204:8765/create_base_folder',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.createdFolder = response.data.message.split(':')[1]
        this.formData = new FormData()
        this.formData.append('employee_id', this.currentEmployeeId)
        axios({
          url: 'http://212.227.210.204:8765/assign_folder/' + this.createdFolder,
          method: 'POST',
          data: this.formData,
          headers: {
            Authorization: this.$auth.getToken('local'),
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.dialogSuccess = true
          this.dialogAddFolder = false
          this.newFolder = ''
          this.department = ''
        }).catch(error => console.log(error))
      }).catch(error => console.log(error))
    },

    /**
     * POST request to assign the previous created-folder to an employee.
     */
    assignFolder () {
      this.formData = new FormData()
      this.formData.append('employee_id', this.currentEmployeeId)
      axios({
        url: 'http://212.227.210.204:8765/assign_folder/' + this.createdFolder,
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.dialogAddFolder = false
        this.newFolder = ''
        this.department = ''
      }).catch(error => console.log(error))
    },

    /**
     * Closes the dialog.
     */
    closeSuccess (event) {
      this.dialogSuccess = false
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.addFolder {
  border-color: #fafafa;
  border-style: solid;
}
</style>
