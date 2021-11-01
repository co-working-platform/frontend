<template>
  <v-container>
    <RecipeComponent />
  </v-container>
</template>
<script>
import RecipeComponent from '@/components/product-page-components/RecipeComponent'
export default {
  components: { RecipeComponent },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  }
}
</script>
