<template>
  <v-container>
    <FileUploadEmployee />
  </v-container>
</template>
<script>
export default {
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  }
}
</script>
