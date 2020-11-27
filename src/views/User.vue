<template>
<div class="container" v-if="!!data">
  <div v-if="nonexist">
    {{data.msg}}
  </div>
  <div v-else>
    <h2>Профиль</h2>
    Пользователь {{ $route.params.id }}
    <p>{{data.fio}}</p>
    <h3>Отзывы о фрилансере</h3>
    <div class="comment a-shadow" v-for="(comment, i) of data.comms" :key="i">
      <user-link :login="comment.authorLogin" :fullPath="false"></user-link>
      <p>{{comment.comm}}</p>
    </div>
  </div>
  <div v-if="loaded">
    <h3 v-if="data.tasks.length > 0">Этот Пользователь откликнулся на Ваши задания!</h3>
    <router-link class="task" :to="'/task?id='+ task._id" v-for="task of data.tasks" :key="task._id">
      <div class="jc-btw">
        <p class="mb-0">{{task.taskInfo}}</p>
        <div class="task-price">
          {{task.price}} руб.
        </div>
      </div>
      <p>Тип: {{task.type}}</p>
      <b-button variant="success" size="sm" @click.prevent="acceptRespond(task._id)">Принять отклик</b-button>
  </router-link>
  </div>
  
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import UserLink from '../components/UserLink.vue'
export default {
  components: { UserLink },
  data: () => ({
    loaded: false,
    data: {},
    nonexist: false
  }),
  computed: {
    userlogin() {
      return this.$route.params.id
    },
    ...mapGetters(['getLogin'])
  },
  watch: {
    userlogin() {
      this.fetchUser()
    }
  },
  created() {
    this.fetchUser()
  },
  methods: {
    fetchUser() {
      const opt = {
        userlogin: this.userlogin,
        login: this.getLogin
      }
      this.$api.GetUser(opt).then(({data}) => {
        if (data.code == 100) {
          this.nonexist = true
        } else this.nonexist = false
        this.data = data

        this.loaded = true;
      })
    },
    acceptRespond(taskId) {
      this.$api.acceptRespond({taskId, login: this.data.login}).then((data) => {
        console.log(data);
        this.$router.push({
          path: '/profile'
        })
      })
    }
  }
}
</script>

<style scoped>
.comment {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
}
</style>