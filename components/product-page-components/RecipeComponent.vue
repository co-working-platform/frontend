<template>
  <v-container v-if="$fetchState.pending">
    <v-skeleton-loader
      type="card"
    />
  </v-container>
  <v-container v-else>
    <v-card id="recipe">
      <v-toolbar elevation="1" class="mb-5">
        <v-toolbar-title>{{ recipe.name }}</v-toolbar-title>
        <v-spacer />
        <v-slider
          v-model="quantitySelected"
          :label="$t('quantity')"
          class="align-center"
          thumb-label
          :min="1"
          :max="100"
        >
          <template #append>
            <v-text-field
              v-model="quantitySelected"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>
      </v-toolbar>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('name') }}
              </th>
              <th class="text-left">
                {{ $t('quantity') }}
              </th>
              <th class="text-left">
                {{ $t('unit') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ingredient in recipe.ingredients"
              :key="ingredient.name"
            >
              <td v-if="ingredient.recipe">
                {{ ingredient.recipe.name }}
                <router-link :to="`/recipe/${ ingredient.recipe.id }`">
                  {{ $t('goToRecipe') }}
                </router-link>
              </td>
              <td v-if="ingredient.rawMaterial">
                {{ ingredient.rawMaterial.name }}
              </td>
              <td>{{ calculateQuantity(ingredient.quantity) }}</td>
              <td>{{ ingredient.unit }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <br>
    <v-card>
      <v-card-title>
        {{ $t('process') }}
      </v-card-title>
      <v-card-subtitle style="font-size:17px;">{{ recipe.description }}</v-card-subtitle>
    </v-card>
    <v-btn
      class="rounded-0 mt-8"
      color="#000000"
      large
      dark
      to="/products"
    >
      {{ $t('backToProducts') }}
    </v-btn>
  </v-container>
</template>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      recipe: {
        id: '',
        ingredients: [],
        description: ''
      },
      quantitySelected: ''
    }
  },
  async fetch () {
    await this.getRecipeById()
  },
  methods: {
    getRecipeById (event) {
      axios.get('http://212.227.210.204:8765/recipe/' + this.$route.params.id)
        .then((response) => {
          this.recipe = response.data
        }).catch((error) => {
          const response = error.response
          console.log(JSON.stringify(response.data.errors))
        })
    },
    calculateQuantity (quantity) {
      return quantity * this.quantitySelected
    }
  }
}
</script>
