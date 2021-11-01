<template>
  <v-container>
    <PlanningCalendar
      v-if="admin"
    />
    <PlanningCalendarDepartment
      v-if="department"
    />
    <PlanningCalendarReadOnly
      v-if="employee"
    />
  </v-container>
</template>
<script>
import PlanningCalendar from '@/components/planning-components/PlanningCalendar'
import PlanningCalendarDepartment from '@/components/planning-components/PlanningCalendarDepartment'
import PlanningCalendarReadOnly from '@/components/planning-components/PlanningCalendarReadOnly'
import axios from 'axios'
export default {
  components: { PlanningCalendar, PlanningCalendarDepartment, PlanningCalendarReadOnly },
  data () {
    return {
      admin: false,
      department: false,
      employee: false
    }
  },
  mounted () {
    if (this.$auth.loggedIn === false) {
      window.location = '/login'
    }
    this.getUser()
  },
  methods: {
    getUser () {
      axios.get('http://212.227.210.204:8765/user', {
        headers: {
          Authorization: this.$auth.getToken('local')
        }
      }).then((response) => {
        if (response.data.role.name === 'CEO' || response.data.role.name === 'ADMIN') {
          this.admin = true
        }
        if (response.data.role.name === 'DEPARTMENT') {
          this.department = true
        }
        if (response.data.role.name === 'EMPLOYEE') {
          this.employee = true
        }
      }).catch((error) => {
        window.alert('An error occurred. Please try again!')
        const response = error.response
        console.log('Method get user error: ' + response)
        console.log('Method get user stringified errors: ' + JSON.stringify(response.data.errors))
      })
    }
  }
}
</script>
