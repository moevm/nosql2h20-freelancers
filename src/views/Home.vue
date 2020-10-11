<template>
  <div>
    {{hello.text}}
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data: () => ({
    hello: {}
  }),
  mounted() {
    this.$api.getHello()
      .then(res => this.hello = res.data[0])
  }
}
</script>