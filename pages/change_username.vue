<template>
  <v-row justify="center">
    <v-col cols="12">
      <UserNameUpdate />
    </v-col>
  </v-row>
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
