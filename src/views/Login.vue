<template lang="html">
  <div class="container">
    <div class="form">
      <b-alert v-model="isAlert" :variant="alertVar" dismissible>
        {{alertText}}
      </b-alert>
      <b-form
        ref="ruleLogin">

        <h2 class="text-center">Вход в приложение</h2>
        <b-input
          class="mb-3"
          type="text"
          v-model="ruleLogin.login"
          name="login"
          auto-complete="off"
          placeholder="Логин">
          </b-input>

        <b-input
          class="mb-3"
          type="password"
          v-model="ruleLogin.password"
          name="password"
          auto-complete="off"
          placeholder="Пароль">
          </b-input>

        <div class="jc-btw">
          <b-button  type="primary" @click.prevent="submitForm()">Войти</b-button>
          <router-link to="reg">Регистрация</router-link>
        </div>
          
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      ruleLogin: {
        login: '',
        password: ''
      },
      isAlert: false,
      alertText: '',
      alertVar: 'danger'
    }
  },
  methods: {
    submitForm () {
      const opt = this.ruleLogin
      if (opt.login.trim() === '' || opt.password.trim() === '') {
        this.isAlert = true
        this.alertText = 'Ошибка! Заполните все поля'
        this.alertVar = 'danger'
        return
      }
      this.$api.UserLogin(opt)
        .then(({data}) => {
          const code = data.code

          if (code === 100) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'warning'

          } else if (code === 50) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'warning'
            setTimeout(() => {
              this.$router.push({
                path: 'reg'
              })
            }, 2000)

          } else if (code === 200) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'success'
            this.$store.dispatch('UserLogin', data.token)
            this.$store.dispatch('UserSetLogin', data.login)
            const redirect = decodeURIComponent(this.$route.query.redirect || '/home')

            setTimeout(() => {
              this.$router.push({
                path: redirect
              })
            }, 1000)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
