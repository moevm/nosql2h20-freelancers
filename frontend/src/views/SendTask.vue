<template>
  <div class="container">
    <h2 style="text-align:center;">Отправить задание на проверку</h2>
      <b-form @submit="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Оставьте ссылку на решение"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.solutionLink"
            type="text"
            required
            placeholder=""
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Оставьте Ваш отзыв!" label-for="input-2">
          <b-form-textarea
            id="input-2"
            v-model="form.comment"
            required
            placeholder=""
          ></b-form-textarea>
        </b-form-group>

        <div style="display: flex; justify-content: center;">
          
        <b-button size="lg" type="submit">Сохранить</b-button>
        </div>
    </b-form>    
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: ['taskId'],
  data: () => ({
    form: {
      solutionLink: '',
      comment: ''
    }
  }),
  computed: mapGetters(['getLogin']),
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$api.sendTask({
        workerLogin: this.getLogin,
        taskId: this.taskId,
        ...this.form
      }).then(data => {
        console.log(data)
        this.$router.push({
          path: '/profile'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>