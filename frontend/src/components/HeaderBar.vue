<template lang="html">
  <div>
    <header class="header">
      <router-link to='/home'><h2>App for freelancers</h2></router-link>
      <div class="panel" v-if="!!getLogin">
        <router-link to='/db' class="mr-3" v-if="getLogin=='admin'">
          <div class="d-flex" style="align-items: baseline;" @click="openProfile()">
            <b-icon scale="1.3" icon="cloud-arrow-down"></b-icon>
            <h6>БД</h6>
          </div>
        </router-link>
        <router-link to="/profile" class="mr-3">
          <div class="d-flex" style="align-items: baseline;" @click="openProfile()">
            <b-icon icon="person-circle" scale="1.3"></b-icon>
            <h6>{{ getLogin }}</h6>
          </div>
        </router-link>
        <b-button size="sm" variant="outline-light" @click="logout()">Выйти</b-button>
      </div>
    </header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderBar',
  computed: {
    ...mapGetters(['getLogin'])
  },
  methods: {
    openProfile() {
      this.$api.getProfile({login: this.getLogin})
      this.$router.push('/profile')
    },
    logout () {
      this.$store.dispatch('UserLogout')
      if (!this.$store.state.token) {
        this.$router.push('/login')
      } else {
        console.log(123);
      }
    }
  }
}
</script>
<style scoped>
header {
  padding: 20px 10px;
  background: url('../assets/bg.jpg') center;
  background-size:contain;
}
header, .panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  
}
a{
  color:#f8f9fa;
}
a:hover{
  color: white;
}
h6{
  margin: 0 0 0 7px;
}
</style>