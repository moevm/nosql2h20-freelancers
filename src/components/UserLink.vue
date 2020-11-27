<template>
  <router-link :to='linkTo'>{{this.login}}</router-link>
</template>

<script>
export default {
  name: 'UserLink',
  props: ['login', 'fullPath'],
  computed: {
    linkTo() {
      return this.fullPath ? 'user/' + this.login : this.login
    }
  }
}
</script>

<style scoped>
a:hover {
  text-decoration: underline !important;
}
</style>