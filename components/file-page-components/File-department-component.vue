<template>
  <v-container
    class="mx-auto"
  >
    <v-form ref="form">
      <v-toolbar>
        <v-container>
          <label class="title">{{ $t('myDepartment') }}</label>
        </v-container>
      </v-toolbar>
      <hr>
      <v-container>
        <v-row>
          <v-col>
            <router-link :to="`/baseFolder/${ departmentId }`" class="router">
              <v-icon
                class="grey lighten-1"
                dark
              >
                mdi-folder
              </v-icon>
            </router-link>
            <v-card-text v-text="department" />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      departmentId: 0,
      department: ''
    }
  },
  /**
   * Method called every time this page is loaded.
   */
  mounted () {
    this.getDepartment()
  },
  methods: {
    /**
     * Get department from local storage
     */
    getDepartment () {
      this.department = localStorage.getItem('department').name
      this.departmentId = this.department.id
    }
  }
}
</script>

<style scoped>
.title {
  font-size: xx-large;
}
</style>
