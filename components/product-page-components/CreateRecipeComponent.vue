<template>
  <v-container>
    <v-toolbar elevation="1" class="mb-5">
      <v-toolbar-title>{{ $t('createNewRecipe') }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col cols="3">
          <v-text-field
            ref="name"
            v-model="recipe.name"
            :label="$t('name')"
            :rules="[required('name')]"
          />
        </v-col>
        <v-col cols="9">
          <v-text-field
            ref="description"
            v-model="recipe.description"
            :label="$t('process')"
            :rules="[required('description')]"
          />
        </v-col>
      </v-row>
      <v-container>
        <h3 class="mt-5 titleIngredient">
          {{ $t('addNormalIngredients') }}
        </h3>
        <v-row v-for="(ingredient, index) in ingredients" :key="index">
          <v-col
            cols="3"
          >
            <v-autocomplete
              v-model="ingredient.name"
              :items="rawMaterialList.map(el => el.name)"
              :rules="[v => !!v || 'Raw Material is required']"
              :label="$t('rawMaterial')"
              persistent-hint
              required
            />
          </v-col>

          <v-col
            cols="3"
          >
            <v-text-field
              v-model="ingredient.quantity"
              :label="$t('quantity')"
              type="number"
              required
            />
          </v-col>

          <v-col
            cols="3"
          >
            <v-text-field
              v-model="ingredient.unit"
              :label="$t('unit')"
              required
            />
          </v-col>
          <v-col
            cols="3"
          >
            <v-btn class="deleteButton" @click="deleteIngredient(index)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-btn @click="addIngredient">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-container>
      <hr>
      <v-container>
        <h3 class="titleIngredient">
          {{ $t('addRecipeAsAnIngredient') }}
        </h3>
        <v-row v-for="(complexIngredient, index) in complexIngredients" :key="index">
          <v-col
            cols="3"
          >
            <v-autocomplete
              v-model="complexIngredient.name"
              :items="recipeList.map(el => el.name)"
              :rules="[v => !!v || 'Recipe is required']"
              :label="$t('recipe')"
              persistent-hint
              required
            />
          </v-col>

          <v-col
            cols="3"
          >
            <v-text-field
              v-model="complexIngredient.quantity"
              :label="$t('quantity')"
              type="number"
              required
            />
          </v-col>

          <v-col
            cols="3"
          >
            <v-text-field
              v-model="complexIngredient.unit"
              :label="$t('unit')"
              required
            />
          </v-col>
          <v-col
            cols="3"
          >
            <v-btn class="deleteButton" @click="deleteComplexIngredient(index)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-btn @click="addComplexIngredient">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-container>
      <v-btn text class="primary mt-10" @click="addRecipe">
        {{ $t('addRecipe') }}
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios'
import validations from '@/utils/validations'
export default {

  data: () => ({
    valid: false,
    formData: null,
    recipe: {
      name: '',
      description: '',
      ingredient_ids: []
    },
    complexIngredients: [
    ],
    ingredients: [
      {
        name: '',
        quantity: '',
        unit: '',
        id: '',
        simple: true
      }
    ],
    finalIngredientList: [],
    rawMaterialList: [],
    recipeList: [],
    ...validations
  }),
  mounted () {
    this.getRawMaterials()
    this.getRecipes()
  },
  methods: {
    addIngredient () {
      this.ingredients.push({
        name: '',
        quantity: '',
        unit: '',
        id: '',
        simple: true
      })
    },
    addComplexIngredient () {
      this.complexIngredients.push({
        name: '',
        quantity: '',
        unit: '',
        id: '',
        simple: false
      })
    },
    deleteIngredient (index) {
      this.ingredients.splice(index, 1)
    },
    deleteComplexIngredient (index) {
      this.complexIngredients.splice(index, 1)
    },
    submit () {
      const data = {
        ingredients: this.ingredients
      }
      alert(JSON.stringify(data, null, 2))
    },
    getRawMaterials (event) {
      axios.get('http://212.227.210.204:8765/raw_materials', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.rawMaterialList = response.data
      }).catch((error) => {
        console.log('did not work')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },
    getRecipes (event) {
      axios.get('http://212.227.210.204:8765/recipes', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        this.recipeList = response.data
      }).catch((error) => {
        console.log('did not work')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    },
    addRecipe () {
      this.ingredients.forEach((ingredient) => {
        this.rawMaterialList.forEach((rawMaterial) => {
          if (ingredient.name === rawMaterial.name) {
            ingredient.id = rawMaterial.id
          }
        })
      })
      this.complexIngredients.forEach((complexIngredient) => {
        this.recipeList.forEach((recipe) => {
          if (complexIngredient.name === recipe.name) {
            complexIngredient.id = recipe.id
          }
        })
      })

      this.ingredients.forEach(el => this.finalIngredientList.push(el))
      this.complexIngredients.forEach(el => this.finalIngredientList.push(el))

      this.finalIngredientList.forEach((element) => {
        element.quantity = parseInt(element.quantity)
      })

      axios({
        url: 'http://212.227.210.204:8765/department/create_ingredients',
        method: 'POST',
        data: JSON.stringify(this.finalIngredientList),
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        this.recipe.ingredient_ids = response.data
        this.addRecipeHelp()
      }).catch((error) => {
        const response = error.response
        console.log(JSON.stringify(response))
      })
    },
    addRecipeHelp () {
      this.formData = new FormData()
      this.formData.append('name', this.recipe.name)
      this.formData.append('description', this.recipe.description)
      this.formData.append('ing_ids', this.recipe.ingredient_ids)

      /*
          Make the request to the POST /single-file URL
        */
      axios({
        url: 'http://212.227.210.204:8765/department/create_recipe',
        method: 'POST',
        data: this.formData,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.linkToProduct(parseInt(response.data.message))
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response))
      })
    },
    linkToProduct (recipeId) {
      const formdata = new FormData()
      formdata.append('recipe', recipeId)
      formdata.append('product', this.$route.params.id)
      axios({
        url: 'http://212.227.210.204:8765/department/link_recipe_to_product',
        method: 'PUT',
        data: formdata,
        headers: {
          Authorization: this.$auth.getToken('local'),
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        this.$router.push('/products')
      }).catch((error) => {
        console.log('in catch')
        const response = error.response
        console.log(JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>

<style>

.deleteButton {
  margin-top: 20px;
}

.titleIngredient {
  font-family: sans-serif;
  font-size: 18px;
}

</style>
