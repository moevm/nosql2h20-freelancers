<template lang="html">
  <div class="container">
    <div class="form">
      <b-alert v-model="isAlert" :variant="alertVar" dismissible>
        {{alertText}}
      </b-alert>
      <b-form ref="ruleRegister">
        <h2 class="text-center">Регистрация</h2>

          <b-form-input class="mb-3" type="text" v-model.number="ruleRegister.login" name="login" auto-complete="off" icon="fa-user" placeholder="Логин">
            </b-form-input>

          <b-form-input class="mb-3" type="password" v-model="ruleRegister.password" name="password" auto-complete="off" icon="fa-key" placeholder="Пароль">
            </b-form-input>

          <b-form-input class="mb-3" type="password" v-model="ruleRegister.checkPassword" name="checkPassword" auto-complete="off" icon="fa-key" placeholder="Пароль еще раз">
            </b-form-input>

          <b-form-input class="mb-3" type="text" v-model="ruleRegister.fio" name="fio" auto-complete="off" icon="fa-key" placeholder="Ваше фио">
            </b-form-input>

          <div class="jc-btw">
            <b-button class="but-faild" type="primary" @click.prevent="submitForm()">Зарегистрироваться</b-button>
            <router-link to="login">Войти</router-link>
          </div>
      </b-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Register',
  data () {
    return {
      ruleRegister: {
        login: '',
        password: '',
        checkPassword: '',
        fio: ''
      },
      isAlert: false,
      alertText: '',
      alertVar: 'danger'
    }
  },
  methods: {
    submitForm () {
      const opt = this.ruleRegister
      opt.login = opt.login.toString().trim()
      opt.password = opt.password.toString().trim()
      opt.checkPassword = opt.checkPassword.toString().trim()

      if (opt.login === '' || opt.password === '' || opt.checkPassword === '' || opt.fio === '') {
        this.isAlert = true
        this.alertText = 'Ошибка! Заполните все поля'
        this.alertVar = 'danger'
      } else if (opt.password !== opt.checkPassword) {
        this.isAlert = true
        this.alertText = "Пароли не совпадают"
        this.alertVar = 'danger'
      } else if (opt.login.length < 3 || opt.password.length < 3 || opt.checkPassword.length < 3) {
        this.isAlert = true
        this.alertText = "Логин и пароль не могут быть короче 3 символов"
        this.alertVar = 'danger'
      } else {
        this.$api.UserAdd(opt)
        .then(({data}) => {
          const code = data.code
          if (code === 50) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'warning'
            setTimeout(() => {
              this.$router.push({
                path: 'login'
              })
            }, 2000)
          } else if (code === 100) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'warning'
          } else if (code === 200) {
            this.isAlert = true
            this.alertText = data.msg + ' ' + data.tip
            this.alertVar = 'success'
            setTimeout(() => {
              this.$router.push({
                path: 'login'
              })
            }, 2000)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
      
    }
  }
}
</script>
