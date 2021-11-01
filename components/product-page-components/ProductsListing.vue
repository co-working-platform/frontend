<template>
  <v-container>
    <v-card elevation="3">
      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="name"
        show-expand
        sort-by="name"
        class="elevation-1"
      >
        <template #top>
          <v-toolbar flat class="mb-5">
            <v-toolbar-title>{{ $t('products') }}</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('search')"
              single-line
              hide-details
            />
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ $t('editItem') }}</span>
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
                          v-model="product.name"
                          :label="$t('productName')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="product.priceInclTax"
                          :label="$t('priceInclVAT')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          ref="category"
                          v-model="product.category.name"
                          :items="categoryList.map(c => c.name)"
                          :rules="[v => !!v || 'Item is required']"
                          :label="$t('categoryName')"
                          required
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-menu
                          top
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              dark
                              v-bind="attrs"
                              v-on="on"
                            >
                              {{ $t('allergens') }}
                            </v-btn>
                          </template>

                          <v-list>
                            <v-list-item
                              v-for="allergen in allergens_with_select"
                              :key="allergen.id"
                            >
                              <input v-model="allergen.selected" type="checkbox" :checked="allergen.selected"> {{ allergen.name }}
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="product.vat"
                          :label="$t('VAT')"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-select
                          v-if="ceo"
                          ref="city"
                          v-model="selectCity"
                          :items="cities.map(el => el.name)"
                          :rules="[v => !!v || 'Item is required']"
                          :label="$t('cityChoice')"
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
                  {{ $t('areYouSureYouWantToDeleteThisItem') }}
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
            v-if="managment"
            small
            class="mr-2"
            @click="editProduct(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="managment"
            small
            @click="removeProduct(item)"
          >
            mdi-delete
          </v-icon>
        </template>

        <template #expanded-item="{ item }">
          <td :colspan="headers.length">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('moreInfo') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $t('allergens') }}: {{ item.allergens.map(a => a.name) }}
                </v-list-item-subtitle>
                <v-list v-if="item.recipe">
                  <v-btn
                    text
                    class="primary"
                    :to="`/recipe/${ item.recipe.id }`"
                  >
                    {{ $t('recipe') }}
                  </v-btn>
                  <v-btn
                    v-if="managment"
                    text
                    class="secondary"
                    @click="unlinkRecipe(item.id)"
                  >
                    {{ $t('deleteRecipeFromProduct') }}
                  </v-btn>
                </v-list>
                <v-list v-else>
                  <v-text>
                    {{ $t('noRecipesCreatedForThisProduct') }}
                  </v-text>
                  <v-btn
                    v-if="managment"
                    text
                    class="primary"
                    :to="`/createRecipe/${ item.id }`"
                  >
                    {{ $t('createRecipe') }}
                  </v-btn>
                </v-list>
              </v-list-item-content>
            </v-list-item>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <br>
    <v-card elevation="3">
      <v-toolbar
        elevation="1"
      >
        <v-toolbar-title v-if="managment">
          {{ $t('createNewProduct') }}
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <v-form
        v-if="managment"
        ref="form"
        v-model="valid"
        class="mt-5"
      >
        <v-row>
          <v-col cols="4">
            <v-text-field
              ref="name"
              v-model="productInfo.name"
              class="ml-5 mr-5"
              :label="$t('name')"
              :rules="[required('Name')]"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="category"
              v-model="productInfo.selectCategory"
              class="ml-5 mr-5"
              :items="categoryList.map(el => el.name)"
              :rules="[v => !!v || 'Category is required']"
              :label="$t('category')"
              required
            />
          </v-col>
          <v-col cols="4">
            <v-select
              ref="allergens"
              v-model="productInfo.allergens"
              class="ml-5 mr-5"
              :items="allergenList.map(el => el.name)"
              :label="$t('allergens')"
              multiple
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              ref="price"
              v-model="productInfo.priceInclTax"
              class="ml-5 mr-5"
              :label="$t('priceInclVAT')"
              :rules="[required('price')]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="productInfo.vat"
              class="ml-5 mr-5"
              :label="$t('VAT')"
              :rules="[required('VAT')]"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-if="ceo"
              ref="city"
              v-model="selectCity"
              class="ml-5 mr-5"
              :items="cities.map(el => el.name)"
              :rules="[v => !!v || 'Item is required']"
              :label="$t('cityChoice')"
              required
            />
          </v-col>
        </v-row>

        <v-checkbox
          v-model="checkbox"
          class="ml-5"
          :rules="[v => !!v || 'You must agree to continue!']"
          :label="$t('isInformationCorrect')"
          required
        />

        <v-btn
          class="ml-5 mb-5"
          color="success"
          :disabled="!valid"
          @click="addProduct()"
        >
          {{ $t('submit') }} {{ buttonText }}
        </v-btn>
        <v-btn
          class="ml-5 mb-5"
          color="error"
          @click="resetForm()"
        >
          {{ $t('resetForm') }} {{ buttonText }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import validations from '@/utils/validations'
export default {
  props: ['submitForm', 'buttonText', 'hasName'],
  data: () => ({
    ceo: false,
    selectCity: '',
    cities: [],
    search: '',
    expanded: [],
    singleExpand: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        value: 'name',
        groupable: false
      },
      { text: 'Category', value: 'category.name', align: 'right' },
      { text: 'Price (incl. VAT)', value: 'priceInclTax', align: 'right' },
      { text: 'VAT %', value: 'vat', align: 'right' },
      { text: 'Price (excl. VAT)', value: 'priceExclTax', align: 'right' },
      // { text: 'Avatar', value: 'avatar', align: 'right' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    id_category: -1,
    formdata: null,
    valid: true,
    alergen: {
      id: '',
      name: ''
    },
    products: [],
    allergenList: [],
    categoryList: [],
    ids: [],
    allergens_from_edit: [],
    allergen_object_from_creation: [],
    allergens_from_creation: [],
    allergens_with_select: [],
    ingredient: {
      id: '',
      name: '',
      quantity: 0,
      unit: ''
    },
    product: {
      id: '',
      name: '',
      allergens: [],
      category: {
        id: '',
        name: ''
      },
      recipe: {
        id: '',
        description: '',
        ingredients: []
      },
      priceInclTax: null,
      vat: null
    },
    productInfo: {
      id: '',
      name: '',
      allergens: [],
      selectCategory: '',
      priceInclTax: null,
      vat: null
    },
    defaultProduct: {
      id: '',
      name: '',
      allergens: [],
      category: {
        id: '',
        name: ''
      },
      recipe: {
        id: '',
        description: '',
        ingredients: []
      },
      priceInclTax: null,
      vat: null
    },
    managment: false,
    checkbox: false,
    editedIndex: -1,
    ...validations
  }),

  computed: {
    formTitle () {
      return 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  mounted () {
    this.getAllProducts()
    this.getCategories()
    this.getAllergens()
    this.getCities()
    if (this.$auth.user.role.name === 'CEO') {
      this.ceo = true
      this.managment = true
    }
    if (this.$auth.user.role.name === 'ADMIN' || this.$auth.user.role.name === 'DEPARTMENT') {
      this.managment = true
    }
  },
  methods: {
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
    getAllProducts () {
      axios.get('http://212.227.210.204:8765/products', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      })
        .then((response) => {
          this.products = response.data
        })
        .catch(error => console.log(error))
    },
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
        console.log(response)
      })
    },
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
        console.log(response)
      })
    },
    findIDAllergensCreation () {
      this.productInfo.allergens = this.productInfo.allergens.toString().split(',')
      this.allergenList.forEach((element) => {
        this.productInfo.allergens.forEach((allergen) => {
          if (element.name === allergen) {
            this.ids.push(element.id)
          }
        })
      })
    },
    findIDCategory () {
      this.categoryList.forEach((element) => {
        if (element.name === this.productInfo.selectCategory) {
          this.id_category = element.id
        }
      })
      if (this.id_category === -1) {
        console.log('no existing id')
      }
    },
    addProduct () {
      this.findIDAllergensCreation()
      this.findIDCategory()
      this.formdata = new FormData()
      this.formdata.append('name', this.productInfo.name)
      this.formdata.append('allergens', this.ids)
      this.formdata.append('cat_id', this.id_category)
      this.formdata.append('recipe_id', '')
      this.formdata.append('price', this.productInfo.priceInclTax)
      this.formdata.append('vat', this.productInfo.vat)
      let id = 0
      if (this.ceo === true) {
        this.cities.forEach((el) => {
          if (el.name === this.selectCity) {
            id = el.id
          }
        })
        this.formdata.append('city', id)
      } else {
        this.formdata.append('city', this.$auth.user.employee.department.city.id)
      }
      /*
          Make the request to the POST /single-file URL
        */
      axios({
        url: 'http://212.227.210.204:8765/department/create_product',
        method: 'POST',
        data: this.formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response))
      })
      window.location.reload()
    },
    findIDAllergens () {
      this.productInfo.allergens = this.productInfo.allergens.toString().split(',')
      this.allergenList.forEach((element) => {
        this.productInfo.allergens.forEach((allergen) => {
          if (element.name === allergen) {
            this.ids.push(element.id)
          }
        })
      })
    },
    getItemById (item) {
      axios.get('http://212.227.210.204:8765/product/' + item.id, {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.product = response.data
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(response)
        console.log(JSON.stringify(response.data.errors))
      })
    },
    editProduct (item) {
      this.getAllergens()
      this.allergens_with_select = []
      this.allergenList.forEach((element) => {
        this.allergens_with_select.push(element)
      })
      this.allergens_with_select.forEach((el) => {
        el.selected = false
      })
      const currentAllergens = item.allergens.map(el => el.name)
      this.allergens_with_select.forEach((el) => {
        currentAllergens.forEach((element) => {
          if (el.name === element) {
            el.selected = true
          }
        })
      })
      const array = []
      this.allergens_with_select.forEach((element) => {
        if (element.selected === true) {
          this.alergen.id = element.id
          this.alergen.name = element.name
          array.push(this.alergen)
        }
      })
      item.allergens = array
      this.product = item
      this.selectCity = item.city.name
      this.dialog = true
    },
    save () {
      this.ids = []
      this.allergens_with_select.forEach((el) => {
        if (el.selected) {
          this.ids.push(el.id)
        }
      })
      this.categoryList.forEach((element) => {
        if (element.name === this.product.category.name) {
          this.product.category.id = element.id
          console.log('changed')
        }
      })
      this.formdata = new FormData()
      this.formdata.append('id', this.product.id)
      this.formdata.append('name', this.product.name)
      this.formdata.append('allergens', this.ids)
      this.formdata.append('cat_id', this.product.category.id)
      if (this.product.recipe !== null) {
        this.formdata.append('recipe_id', this.product.recipe.id)
      } else {
        this.formdata.append('recipe_id', '')
      }
      this.formdata.append('price', this.product.priceInclTax)
      this.formdata.append('vat', this.product.vat)
      let id = 0
      if (this.ceo === true) {
        this.cities.forEach((el) => {
          if (el.name === this.selectCity) {
            id = el.id
          }
        })
        this.formdata.append('city', id)
      } else {
        this.formdata.append('city', this.$auth.user.employee.department.city.id)
      }
      axios({
        url: 'http://212.227.210.204:8765/department/update_product',
        method: 'PUT',
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        },
        data: this.formdata
      }).then((response) => {
        window.location.reload()
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
      this.products = this.getAllProducts()
      this.close()
      window.location.reload()
    },

    removeProduct (x) {
      this.product = Object.assign(this.product, x)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      axios({
        url: 'http://212.227.210.204:8765/department/delete_product/' + this.product.id.toString(),
        method: 'DELETE',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
      this.closeDelete()
      this.products = this.getAllProducts()
    },

    unlinkRecipe (productId) {
      axios({
        url: 'http://212.227.210.204:8765/department/remove_recipe_from_product/' + productId,
        method: 'PUT',
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
      }).catch((error) => {
        console.log('in catch')
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
      window.location.reload()
    },

    close () {
      this.dialog = false
      this.resetForm()
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.productInfo = Object.assign({}, this.defaultProduct)
        this.editedIndex = -1
      })
      window.location.reload()
      // this.resetForm()
    },

    resetForm () {
      this.$refs.form.reset()
    },

    exportpdf () {
      // TODO export to pdf the employees array
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
