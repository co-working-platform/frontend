<template>
  <v-container>
    <EmployeeFolderComponent />
  </v-container>
</template>

<script>
import EmployeeFolderComponent from '@/components/employee-page-components/EmployeeFolderComponent'
export default {
  components: { EmployeeFolderComponent },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
  }
}
</script>
