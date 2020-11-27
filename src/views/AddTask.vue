<template>
  <div class="container">
    <h3 style="text-align:center;">Создать новое задание</h3>
      <b-form @submit="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Подробно опишите вашу проблему"
          label-for="input-1"
        >
          <b-form-textarea
            id="input-1"
            v-model="form.text"
            type="text"
            required
            placeholder=""
          ></b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-2" label="Укажите тип задания" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.type"
            required
            placeholder=""
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Укажите цену" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.price"
            required
            type="number"
            placeholder=""
          ></b-form-input>
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
  data: () => ({
    form: {
      text: '',
      type: '',
      price: ''
    }
  }),
  computed: mapGetters(['getLogin']),
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$api.addTask({
        workerLogin: this.getLogin,
        ...this.form
      }).then(data => {
        console.log(data);
        this.$router.push({
          path: '/home'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>