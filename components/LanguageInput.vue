<template>
  <div class="lang-dropdown">
    <select v-model="langChoice" @change="(e) => $i18n.setLocale(e.target.value)">
      <option
        v-for="lang in $i18n.locales"
        :key="lang.code"
        :value="lang.code"
        :onchange="$i18n.setLocale"
      >
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      langChoice: this.$store.state.i18n.locale
    }
  }
}
</script>
