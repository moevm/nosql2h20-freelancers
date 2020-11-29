<template>
  <div class="container" v-if="!!data">
    <h2 style="text-align:center;">Задание готово</h2>
    <p>
        Ваше задание было  завершено филансером. Перейдите к оплате работы фрилансеру
    </p>
    <div style="display: flex; justify-content: space-between;">
      <span>Цена:</span>
      <div class="task-price">
        {{data.price}} руб.
      </div>
    </div>
    <h3>Ссылка на решение</h3>
    <p>{{data.solutionLink}}</p>
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-2" label="Оставьте Ваш отзыв!" label-for="input-2">
          <b-form-textarea
            id="input-2"
            v-model="comment"
            required
            placeholder=""
          ></b-form-textarea>
        </b-form-group>

        <div style="display: flex; justify-content: center;">
          
        <b-button size="lg" type="submit">Оплатить</b-button>
        </div>
    </b-form>    
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: ['taskId'],
  data: () => ({
    data: null,
    comment: ''
  }),
  computed: mapGetters(['getLogin']),
  created() {
    console.log(this.taskId);
    this.$api.getTaskById({taskId: this.taskId}).then(({data}) => {
      this.data= data
    })
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.$api.payTask({
        taskId: this.taskId,
        comment: this.comment
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