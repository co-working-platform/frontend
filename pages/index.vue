<template>
  <v-container>
    <section class="section">
      <div class="container">
        <v-img src="/logo.png" @click="goToLogin" />
      </div>
    </section>
  </v-container>
</template>

<script>
export default {
  methods: {
    goToLogin () {
      this.$router.push('/login')
    }
  }

}
</script>
