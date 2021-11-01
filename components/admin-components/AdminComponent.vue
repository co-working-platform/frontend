<template>
  <v-container
    class="mx-auto"
  >
    <v-row>
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="addDepartment"
        >
          {{ $t('addDepartment') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="deleteDepartment"
        >
          {{ $t('deleteDepartment') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updateDepartment"
        >
          {{ $t('updateDepartment') }}
        </v-btn>
      </v-col>
      <v-dialog v-model="dialogUpdateDepartment" max-width="500px">
        <v-form ref="formUpdateDep">
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="department in departmentList"
                  :key="department.id"
                  class="list"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="department.name" />

                    <v-list-item-subtitle v-text="department.city.name" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      class="grey lighten-1"
                      dark
                      @click="editDepartment(department)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeUpdate">
                {{ $t('cancel') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogEditDepartment" max-width="500px">
        <v-form ref="formEditDepartment">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="newDepartment" class="addDep" :placeholder="$t('departmentName')" type="text">
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
      <v-dialog v-model="dialogDeleteDepartment" max-width="500px">
        <v-form ref="formDeleteDep">
          <v-card>
            <v-card-text>
              <v-select
                ref="department"
                v-model="selectDepartment"
                :items="departmentList.map(el => (el.name + ' ' + el.city.name))"
                :rules="[v => !!v || $t('itemIsRequired')]"
                :label="$t('department')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDelete">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteDepartmentConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogAddDepartment" max-width="500px">
        <v-form ref="formAddDep">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="departmentName" class="addDep" :placeholder="$t('departmentName')" type="text">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAdd">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addDepartmentConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogSuccess" class="success" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            {{ $t('success') }}!
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
    </v-row>

    <hr>
    <v-row>
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="addAllergen"
        >
          {{ $t('addAllergen') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="deleteAllergen"
        >
          {{ $t('deleteAllergen') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updateAllergen"
        >
          {{ $t('updateAllergen') }}
        </v-btn>
      </v-col>
      <v-dialog v-model="dialogAddAllergen" max-width="500px">
        <v-form ref="formAddAllergen">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="allergenName" class="addDep" :placeholder="$t('allergenName')" type="text">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAddAllergen">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addAllergenConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogDeleteAllergen" max-width="500px">
        <v-form ref="formDeleteAllergen">
          <v-card>
            <v-card-text>
              <v-select
                ref="allergen"
                v-model="selectAllergen"
                :items="allergenList.map(el => el.name)"
                :rules="[v => !!v || $t('itemIsRequired')]"
                :label="$t('allergen')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDeleteAllergen">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteAllergenConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogUpdateAllergen" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="allergen in allergenList"
                  :key="allergen.id"
                  class="list"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="allergen.name" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      class="grey lighten-1"
                      dark
                      @click="editAllergen(allergen)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeUpdateAllergen">
                {{ $t('cancel') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogEditAllergen" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="editedAllergen" class="addDep" :placeholder="$t('allergenName')" type="text">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeEditAllergen">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="editAllergenConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>

    <hr>

    <v-row>
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="addCategory"
        >
          {{ $t('addCategory') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="deleteCategory"
        >
          {{ $t('deleteCategory') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updateCategory"
        >
          {{ $t('updateCategory') }}
        </v-btn>
      </v-col>
      <v-dialog v-model="dialogAddCategory" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="categoryName" class="addDep" :placeholder="$t('categoryName')" type="text">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAddCategory">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addCategoryConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogDeleteCategory" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-select
                ref="category"
                v-model="selectCategory"
                :items="categoryList.map(el => el.name)"
                :rules="[v => !!v || $t('itemIsRequired')]"
                :label="$t('category')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDeleteCategory">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteCategoryConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogUpdateCategory" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="category in categoryList"
                  :key="category.id"
                  class="list"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="category.name" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      class="grey lighten-1"
                      dark
                      @click="editCategory(category)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeUpdateCategory">
                {{ $t('cancel') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogEditCategory" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <input v-model="editedCategory" class="addDep" :placeholder="$t('categoryName')" type="text">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeEditCategory">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="editCategoryConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>

    <hr>

    <v-row>
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="addRawMaterial"
        >
          {{ $t('addRawMaterial') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="deleteRawMaterial"
        >
          {{ $t('deleteRawMaterial') }}
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="updateRawMaterial"
        >
          {{ $t('updateRawMaterial') }}
        </v-btn>
      </v-col>
      <v-dialog v-model="dialogAddRawMaterial" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <label>{{ $t('name') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialName" class="addDep" :placeholder="$t('addName')" type="text">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>{{ $t('supplier') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialSupplier" class="addDep" :placeholder="$t('addSupplier')" type="text">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>{{ $t('price') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialPrice" class="addDep" :placeholder="$t('addPrice')" type="number">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>VAT</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialVat" class="addDep" :placeholder="$t('addVAT')" type="number">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeAddRawMaterial">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="addRawMaterialConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogDeleteRawMaterial" max-width="500px">
        <v-form ref="formDeleteAllergen">
          <v-card>
            <v-card-text>
              <v-select
                ref="allergen"
                v-model="selectRawMaterial"
                :items="rawMaterialList.map(el => (el.name + ' from ' + el.supplier + ' with price ' + el.price + ' and vat ' + el.vat))"
                :rules="[v => !!v || $t('itemIsRequired')]"
                :label="$t('rawMaterial')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDeleteRawMaterial">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteRawMaterialConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogUpdateRawMaterial" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="rawMaterial in rawMaterialList"
                  :key="rawMaterial.id"
                  class="list"
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col>
                        <v-list-item-title v-text="rawMaterial.name" />
                      </v-col>
                      <v-col>
                        <v-list-item-subtitle v-text="rawMaterial.supplier" />
                      </v-col>
                      <v-col>
                        <v-list-item-subtitle v-text="rawMaterial.price" />
                      </v-col>
                      <v-col>
                        <v-list-item-subtitle v-text="rawMaterial.vat" />
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      class="grey lighten-1"
                      dark
                      @click="editRawMaterial(rawMaterial)"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeUpdateRawMaterial">
                {{ $t('cancel') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-dialog v-model="dialogEditRawMaterial" max-width="500px">
        <v-form>
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <label>{{ $t('name') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialName" class="addDep" :placeholder="$t('editName')" type="text">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>{{ $t('supplier') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialSupplier" class="addDep" :placeholder="$t('editSupplier')" type="text">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>{{ $t('price') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialPrice" class="addDep" :placeholder="$t('editPrice')" type="number">
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <label>{{ $t('VAT') }}</label>
                  </v-col>
                  <v-col>
                    <input v-model="rawMaterialVat" class="addDep" :placeholder="$t('editVAT')" type="number">
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeEditRawMaterial">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="editRawMaterialConfirmation">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
    <hr>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="rounded-0"
          color="#000000"
          x-large
          block
          dark
          @click="dialogValidations = true"
        >
          {{ $t('editWorkingHoursConfigurations') }}
        </v-btn>
      </v-col>
      <v-dialog
        v-model="dialogValidations"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ $t('editWorkingHoursConfigurations') }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.start_night"
                    :label="$t('startOfTheNightShift')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.end_night"
                    :label="$t('endOfTheNightShift')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.max_per_day"
                    :label="$t('maximumTotalAmountOfHoursWorkedInADay')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.max_hours"
                    :label="$t('maximumTotalAmountOfHoursWithoutTakingABreak')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.break_length"
                    :label="$t('minimumAmountOfTimeABreakCanBe')"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  sm="6"
                >
                  <v-text-field
                    v-model="planning_config.hours_between_shifts"
                    :label="$t('minimumAmountOfHoursBetweenShiftsOnTwoDifferentDays')"
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
              @click="dialogValidations = false"
            >
              {{ $t('cancel') }}
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveConfig"
            >
              {{ $t('save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Vuex from 'vuex'

const store = new Vuex.Store(
  {
    state: {
      departmentList: []
    },
    getters: {
      departmentList: (state) => {
        const temp = state.departmentList
        return temp
      },
      departmentName: state => (name) => {
        return state.departmentList.find(department => name === (department.name + ' ' + department.city.name))
      }
    }
  })
export default {
  data () {
    return {
      user: null,

      selectCity: '',
      cities: [],
      dialogAddDepartment: false,
      formData: null,
      departmentName: '',
      dialogSuccess: false,
      dialogDeleteDepartment: false,
      departmentList: [],
      selectDepartment: '',
      dialogUpdateDepartment: false,
      dialogEditDepartment: false,
      newCity: '',
      newDepartment: '',
      city: {
        id: 0,
        name: ''
      },
      editId: 0,
      dialogAddCity: false,
      cityName: '',
      currentCity: '',
      dialogDeleteCity: false,
      selectDeleteCity: '',

      dialogValidations: false,
      planning_config: {
        id: -1,
        start_night: 0,
        end_night: 0,
        max_per_day: 0,
        max_hours: 0,
        break_length: 0,
        hours_between_shifts: 0
      },

      dialogAddAllergen: false,
      allergenName: '',
      dialogDeleteAllergen: false,
      selectAllergen: '',
      allergenList: [],
      dialogUpdateAllergen: false,
      dialogEditAllergen: false,
      editedAllergen: '',
      helper: '',
      dialogAddRawMaterial: false,
      rawMaterialName: '',
      rawMaterialSupplier: '',
      rawMaterialPrice: 0,
      rawMaterialVat: 0,
      dialogDeleteRawMaterial: false,
      selectRawMaterial: '',
      rawMaterialList: [],
      dialogUpdateRawMaterial: false,
      dialogEditRawMaterial: false,
      dialogAddCategory: false,
      categoryName: '',
      dialogDeleteCategory: false,
      selectCategory: '',
      categoryList: [],
      dialogUpdateCategory: false,
      dialogEditCategory: false,
      editedCategory: ''
    }
  },
  watch: {
    dialogAddDepartment (val) {
      val || this.closeAdd()
    },
    dialogSuccess (val) {
      val || this.closeSuccess()
    },
    dialogDeleteDepartment (val) {
      val || this.closeDelete()
    },
    dialogUpdateDepartment (val) {
      val || this.closeUpdate()
    },
    dialogEditDepartment (val) {
      val || this.closeEdit()
    },
    dialogUpdateAllergen (val) {
      val || this.closeUpdateAllergen()
    },
    dialogEditAllergen (val) {
      val || this.closeEditAllergen()
    },
    dialogAddAllergen (val) {
      val || this.closeAddAllergen()
    },
    dialogDeleteAllergen (val) {
      val || this.closeDeleteAllergen()
    },
    dialogAddRawMaterial (val) {
      val || this.closeAddRawMaterial()
    },
    dialogDeleteRawMaterial (val) {
      val || this.closeDeleteRawMaterial()
    },
    dialogUpdateRawMaterial (val) {
      val || this.closeUpdateRawMaterial()
    },
    dialogEditRawMaterial (val) {
      val || this.closeEditRawMaterial()
    },
    dialogUpdateCategory (val) {
      val || this.closeUpdateCategory()
    },
    dialogEditCategory (val) {
      val || this.closeEditCategory()
    },
    dialogAddCategory (val) {
      val || this.closeAddCategory()
    },
    dialogDeleteCategory (val) {
      val || this.closeDeleteCategory()
    }
  },

  /**
   * Mounted method is called every time the page reloads.
   */
  mounted () {
    this.getWorkingHoursConfig()
    this.getUser()
  },

  methods: {
    /**
     * GET method to get the authenticated user.
     * Also, sets the first and last name of the logged in user
     * in the local storage for further features, such as changing the name.
     */
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.user = response.data
        if (this.user.role.name === 'CEO' || this.user.role.name === 'ADMIN' || this.user.role.name === 'DEPARTMENT') {
          this.finalItems = this.items
        }
        if (this.user.role.name === 'EMPLOYEE') {
          this.items.forEach((el) => {
            if (el.title !== 'Employees') {
              this.finalItems.push({
                icon: el.icon,
                title: el.title,
                to: el.to
              })
            }
          })
        }
        if (this.user.employee.folder !== null) {
          this.finalItems.push({
            icon: 'mdi-chart-bubble',
            title: 'Folder',
            to: '/employeeFolder/' + this.user.employee.folder.id
          })
        }
      }).catch((error) => {
        if (this.user.employee.photo === null) {
          return
        }
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event to edit raw material
     * @param item that needs to be edited.
     */
    editRawMaterial (item) {
      this.helper = item
      this.rawMaterialName = item.name
      this.rawMaterialSupplier = item.supplier
      this.rawMaterialPrice = item.price
      this.rawMaterialVat = item.vat
      this.dialogEditRawMaterial = true
    },

    /**
     * Hide edit raw material dialog.
     */
    closeEditRawMaterial () {
      this.dialogUpdateRawMaterial = false
      this.dialogEditRawMaterial = false
    },

    /**
     * PUT request to edit a raw material
     */
    editRawMaterialConfirmation () {
      const aux = {
        id: this.helper.id,
        name: this.rawMaterialName,
        supplier: this.rawMaterialSupplier,
        price: this.rawMaterialPrice,
        vat: this.rawMaterialVat
      }
      axios({
        url: 'http://212.227.210.204:8765/admin/update_raw_material',
        method: 'PUT',
        data: aux,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeEditRawMaterial()
        this.closeUpdateRawMaterial()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event to update raw material
     */
    updateRawMaterial () {
      this.getRawMaterials()
      this.dialogUpdateRawMaterial = true
    },

    /**
     * Hide update raw material dialog.
     */
    closeUpdateRawMaterial () {
      this.dialogUpdateRawMaterial = false
    },

    /**
     *  GET request to obtain a list with all the raw materials.
     */
    getRawMaterials () {
      axios.get('http://212.227.210.204:8765/raw_materials', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.rawMaterialList = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event to delete raw material
     */
    deleteRawMaterial () {
      this.getRawMaterials()
      this.dialogDeleteRawMaterial = true
    },

    /**
     * Hide delete raw material dialog.
     */
    closeDeleteRawMaterial () {
      this.dialogDeleteRawMaterial = false
      this.selectRawMaterial = ''
    },

    /**
     * DELETE request to delete a raw material
     */
    deleteRawMaterialConfirmation () {
      let id = 0
      this.rawMaterialList.forEach((el) => {
        if ((el.name + ' from ' + el.supplier + ' with price ' + el.price + ' and vat ' + el.vat) === this.selectRawMaterial) {
          id = el.id
        }
      })
      axios({
        url: 'http://212.227.210.204:8765/admin/delete_raw_material/' + id,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then(() => {
        this.dialogSuccess = true
        this.closeDeleteRawMaterial()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event to add raw material
     */
    addRawMaterial () {
      this.dialogAddRawMaterial = true
    },

    /**
     * Hide add row material dialog.
     */
    closeAddRawMaterial () {
      this.dialogAddRawMaterial = false
      this.rawMaterialName = ''
      this.rawMaterialSupplier = ''
      this.rawMaterialPrice = 0
      this.rawMaterialVat = 0
    },

    /**
     * POST request to add a raw material
     */
    addRawMaterialConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.rawMaterialName)
      this.formData.append('supplier', this.rawMaterialSupplier)
      this.formData.append('price', this.rawMaterialPrice)
      this.formData.append('vat', this.rawMaterialVat)
      axios({
        url: 'http://212.227.210.204:8765/admin/create_raw_material',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddRawMaterial()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(response)
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for edit allergen button
     * @param allergen to be edited
     */
    editAllergen (allergen) {
      this.helper = allergen
      this.dialogEditAllergen = true
      this.editedAllergen = allergen.name
    },

    /**
     * Hide edit allergen dialog.
     */
    closeEditAllergen () {
      this.dialogEditAllergen = false
      this.dialogUpdateAllergen = false
    },

    /**
     * PUT request to edit an allergen.
     */
    editAllergenConfirmation () {
      const aux = {
        id: this.helper.id,
        name: this.editedAllergen
      }
      axios({
        url: 'http://212.227.210.204:8765/admin/update_allergen',
        method: 'PUT',
        data: aux,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeEditAllergen()
        this.closeUpdateAllergen()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for update allergen button.
     */
    updateAllergen () {
      this.getAllergens()
      this.dialogUpdateAllergen = true
    },

    /**
     * Hide update allergen dialog.
     */
    closeUpdateAllergen () {
      this.dialogUpdateAllergen = false
    },

    /**
     *  GET request to obtain a list with all the allergens.
     */
    getAllergens () {
      axios.get('http://212.227.210.204:8765/allergens', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.allergenList = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for delete allergen button.
     */
    deleteAllergen () {
      this.getAllergens()
      this.dialogDeleteAllergen = true
    },

    /**
     * Hide delete allergen dialog.
     */
    closeDeleteAllergen () {
      this.dialogDeleteAllergen = false
      this.selectAllergen = ''
    },

    /**
     * DELETE request to delete an allergen.
     */
    deleteAllergenConfirmation () {
      let id = 0
      this.allergenList.forEach((el) => {
        if (el.name === this.selectAllergen) {
          id = el.id
        }
      })
      axios({
        url: 'http://212.227.210.204:8765/admin/delete_allergen/' + id,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then(() => {
        this.dialogSuccess = true
        this.closeDeleteAllergen()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for edit department button.
     * @param department to be edited.
     */
    editDepartment (department) {
      this.editId = department.id
      this.newCity = department.city.name
      this.newDepartment = department.name
      this.dialogEditDepartment = true
    },

    /**
     * Hide edit department dialog.
     */
    closeEdit () {
      this.dialogEditDepartment = false
      this.dialogUpdateDepartment = false
    },

    /**
     * PUT request to edit a department.
     */
    editDepartmentConfirmation () {
      const dep = {
        id: this.editId,
        name: this.newDepartment,
        city: this.user.employee.department.city
      }
      axios({
        url: 'http://212.227.210.204:8765/admin/update_department',
        method: 'PUT',
        data: dep,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.dialogEditDepartment = false
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for update department button.
     */
    updateDepartment () {
      this.getDepartments()
      this.dialogUpdateDepartment = true
    },

    /**
     * Hide update department dialog.
     */
    closeUpdate () {
      this.departmentList = []
      this.dialogUpdateDepartment = false
      // this.$refs.formEditDepartment.reset()
      // this.newDepartment = ''
    },

    /**
     * Find a city object by its name.
     * @param cityName name of the searched city
     */
    getCityById (cityName) {
      this.getCities()
      let id = -1
      this.cities.forEach((el) => {
        if (el.name === cityName) {
          id = el.id
        }
      })
      axios({
        url: 'http://212.227.210.204:8765/city/' + id,
        method: 'GET',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.city = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * DELETE request to delete a department.
     */
    deleteDepartmentConfirmation () {
      const departmentId = store.getters.departmentName(this.selectDepartment).id
      axios({
        url: 'http://212.227.210.204:8765/admin/delete_department/' + departmentId,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.$refs.formDeleteDep.reset()
        this.dialogDeleteDepartment = false
        this.selectDepartment = ''
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for delete department button.
     */
    deleteDepartment () {
      this.getDepartments()
      this.dialogDeleteDepartment = true
    },

    /**
     * Hide delete department dialog.
     */
    closeDelete () {
      this.departmentList = []
      this.dialogDeleteDepartment = false
    },

    /**
     * POST request to create a new department.
     */
    addDepartmentConfirmation () {
      this.formData = new FormData()
      this.formData.set('name', this.departmentName)
      this.formData.set('city', this.user.employee.department.city.name)
      axios({
        url: 'http://212.227.210.204:8765/admin/create_department',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.departmentName = ''
        this.$refs.formAddDep.reset()
        this.dialogAddDepartment = false
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for create department button.
     */
    addDepartment () {
      this.getCities()
      this.dialogAddDepartment = true
    },

    /**
     * GET request tpo get a list with all the cities in database.
     * @param event
     */
    getCities (event) {
      axios.get('http://212.227.210.204:8765/cities', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.cities = response.data
        // store.state.cityList = this.cities
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Hide success dialog.
     * @param event
     */
    closeSuccess (event) {
      this.dialogSuccess = false
      window.location.reload()
    },

    /**
     * Hide add department dialog.
     */
    closeAdd () {
      this.dialogAddDepartment = false
    },

    /**
     * GET request tpo get a list with all the departments within the authenticated user's city.
     */
    getDepartments () {
      axios.get('http://212.227.210.204:8765/departments/' + this.user.employee.department.city.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const aux = response.data
        aux.forEach((el) => {
          if (el.name !== 'CeoDepartment') {
            this.departmentList.push(el)
          }
        })
        store.state.departmentList = this.departmentList
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for create allergen button.
     */
    addAllergen () {
      this.dialogAddAllergen = true
    },

    /**
     * Hide create allergen dialog.
     */
    closeAddAllergen () {
      this.dialogAddAllergen = false
      this.allergenName = ''
    },

    /**
     * POST request to create an allergen.
     */
    addAllergenConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.allergenName)
      axios({
        url: 'http://212.227.210.204:8765/admin/create_allergen',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddAllergen()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for create category button.
     */
    addCategory () {
      this.dialogAddCategory = true
    },

    /**
     * Hide create category dialog.
     */
    closeAddCategory () {
      this.dialogAddCategory = false
      this.categoryName = ''
    },

    /**
     * POST request to create a category.
     */
    addCategoryConfirmation () {
      this.formData = new FormData()
      this.formData.append('name', this.categoryName)
      axios({
        url: 'http://212.227.210.204:8765/admin/create_category',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeAddCategory()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for edit category button.
     * @param category to be edited
     */
    editCategory (category) {
      this.helper = category
      this.dialogEditCategory = true
      this.editedCategory = category.name
    },

    /**
     * Hide edit category dialog.
     */
    closeEditCategory () {
      this.dialogEditCategory = false
      this.dialogUpdateCategory = false
    },

    /**
     * PUT request to edit a category.
     */
    editCategoryConfirmation () {
      const aux = {
        id: this.helper.id,
        name: this.editedCategory
      }
      axios({
        url: 'http://212.227.210.204:8765/admin/update_category',
        method: 'PUT',
        data: aux,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.closeEditCategory()
        this.closeUpdateCategory()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for update categories button.
     */
    updateCategory () {
      this.getCategories()
      this.dialogUpdateCategory = true
    },

    /**
     * Hide update categories dialog.
     */
    closeUpdateCategory () {
      this.dialogUpdateCategory = false
    },

    /**
     * GET request to get a list with all the categories in the database.
     */
    getCategories () {
      axios.get('http://212.227.210.204:8765/categories', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.categoryList = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Event for delete category button.
     */
    deleteCategory () {
      this.getCategories()
      this.dialogDeleteCategory = true
    },

    /**
     * Hide delete category dialog.
     */
    closeDeleteCategory () {
      this.dialogDeleteCategory = false
      this.selectCategory = ''
    },

    /**
     * DELETE request to delete a category.
     */
    deleteCategoryConfirmation () {
      let id = 0
      this.categoryList.forEach((el) => {
        if (el.name === this.selectCategory) {
          id = el.id
        }
      })
      axios({
        url: 'http://212.227.210.204:8765/admin/delete_category/' + id,
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then(() => {
        this.dialogSuccess = true
        this.closeDeleteCategory()
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * GET request to get the current working hours configurations
     * for the authenticated user.
     */
    getWorkingHoursConfig () {
      axios.get('http://212.227.210.204:8765/admin/get_planning_configuration', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        const config = response.data
        this.planning_config.id = config.id
        this.planning_config.start_night = config.startOfNightShift
        this.planning_config.end_night = config.endOfNightShift
        this.planning_config.max_per_day = config.maxHoursPerDay
        this.planning_config.max_hours = config.maxConsecutiveHours
        this.planning_config.break_length = config.breakLengthMin
        this.planning_config.hours_between_shifts = config.hoursBetweenShifts
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },

    /**
     * Saves the newly updates configurations of
     * the working hours validations.
     */
    saveConfig () {
      this.formData = new FormData()
      this.formData.append('id', this.planning_config.id)
      this.formData.append('start_night', this.planning_config.start_night)
      this.formData.append('end_night', this.planning_config.end_night)
      this.formData.append('max_per_day', this.planning_config.max_per_day)
      this.formData.append('max_hours', this.planning_config.max_hours)
      this.formData.append('break_length', this.planning_config.break_length)
      this.formData.append('hours_between_shifts', this.planning_config.hours_between_shifts)
      axios({
        url: 'http://212.227.210.204:8765/admin/update_planning_configuration',
        method: 'PUT',
        data: this.formData,
        // data: this.planning_config,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
          // 'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.dialogSuccess = true
        this.dialogValidations = false
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
.addDep {
  border-color: #fafafa;
  border-style: solid;
}

.style {
  background: #1e1e1e;
  color: snow;
}

.myClass {
  background: #1e1e1e;
  color: snow;
}

.list {
  border-style: solid;
  border-color: darkgrey;
}
</style>
