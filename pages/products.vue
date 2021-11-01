<template>
  <ProductsListing />
</template>
<script>
import ProductsListing from '@/components/product-page-components/ProductsListing'
export default {
  components: { ProductsListing },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  }
}
</script>
