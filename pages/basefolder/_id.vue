<template>
  <v-container>
    <AdminBaseFolderComponent />
  </v-container>
</template>
<script>
import AdminBaseFolderComponent from '@/components/folder-components/AdminBaseFolderComponent'
export default {
  components: { AdminBaseFolderComponent },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  }
}
</script>
