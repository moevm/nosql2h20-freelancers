<template>
  <div class="container" v-if="!!data">
    <h2>Задание</h2>
    <div v-if="getLogin == data.employerLogin">

      <h5>Информация</h5>
      <p>{{data.taskInfo}}</p>
      <div class="jc-btw">
        <span>Цена:</span>
        <div class="task-price">
          {{data.price}} руб.
        </div>
      </div>
      <div class="jc-btw">
        <span>Тип</span>
        <span>
          {{data.type}}
        </span>
      </div>
      <div class="jc-btw">
        <span>Статус</span>
        <span>
          {{getStatus(data.currStatus)}}
        </span>
      </div>
      <div class="jc-btw">
        <span>Заказчик:</span>
        <span>Вы</span>
      </div>
      <div class="jc-btw">
        <span>Взялся за выполнение:</span>
        <user-link :login="data.workerLogin" :fullPath="true"></user-link>
      </div>
      <hr>
      <div v-if="data.currStatus=='waiting'">
        <h5>Отклики на Ваше задание:</h5>
        <b-col>
          <p v-if="data.applicantsList.length == 0">Здесь пока никого нет :(</p>
          <user-link v-for="login of data.applicantsList" :key="login" :login="login" :fullPath="true" style="display:block;">
          </user-link>
        </b-col>
      </div>
      
    </div>

    <div v-else>
      <h5>Информация</h5>
      <p>{{data.taskInfo}}</p>
      <div class="jc-btw">
        <span>Цена:</span>
        <div class="task-price">
          {{data.price}} руб.
        </div>
      </div>
      <div class="jc-btw">
        <span>Тип</span>
        <span>
          {{data.type}}
        </span>
      </div>
      <div class="jc-btw">
        <span>Статус</span>
        <span>
          {{getStatus(data.currStatus)}}
        </span>
      </div>
      <div class="jc-btw">
        <span>Заказчик:</span>
        <user-link :login="data.employerLogin" :fullPath="true"></user-link>
      </div>
      <div class="jc-btw">
        <span>Взялся за выполнение:</span>
        <user-link :login="data.workerLogin" :fullPath="true"></user-link>
      </div>
      <hr>
      <div v-if="data.currStatus=='waiting'" style="display: flex;justify-content: center;">
        <b-button size="lg" variant="success" @click="respondTask()" v-if="!data.applicantsList.includes(getLogin)">Откликнуться</b-button>
        <p v-else>Вы уже откликнулись на это задание! Ожидайте принятия отклика.</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import UserLink from '../components/UserLink.vue'
export default {
  components: { UserLink },
  props: ['taskId'],
  data: () => ({
    data: null
  }),
  created() {
    this.$api.getTaskById({taskId: this.taskId}).then(({data}) => {
      this.data = data
    })
  },
  computed: mapGetters(['getLogin']),
  methods: {
    respondTask() {
      this.$api.respondTask({taskId: this.taskId, login: this.getLogin}).then(() => {
        this.$router.push({
          path: '/profile'
        })
      })
    },
    getStatus(status) {
      if (status == 'waiting') {
        return 'Ожидание'
      } else if (status == 'in-progress') {
        return 'Выполняется'
      } else if (status == 'done') {
        return 'Завершено'
      } else if (status == 'finished') {
        return 'Завершено и оплачено'
      }
    }
  }
}
</script>

<style scoped>

</style>