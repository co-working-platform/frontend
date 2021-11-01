<template>
  <v-app dark>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer> Noé  &copy; {{ new Date().getFullYear() }} </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: 'Noé workspace'
    }
  }
}
</script>
