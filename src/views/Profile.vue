<template>
  <div>
    <div class="container" v-if="!!data">
      <h2>Личный кабинет</h2>
      <p>{{data.fio}}</p>
      <h3>Ваши задания</h3>
      
      <div v-if="data.authorOfTasks.length == 0"><p>Здесь пока пусто</p></div>
      <router-link class="task a-shadow a-shadow-hov" :to="'/task?id='+ task._id" :class="task.currStatus" v-for="task of data.authorOfTasks" :key="task._id" v-else>
        <div class="jc-btw">
          <p>{{task.taskInfo}}</p>
          
          <div class="task-price">
            {{task.price}} руб.
          </div>
        </div>
        <p>Статус: {{getStatus(task.currStatus)}}</p>
        <router-link :to="'/paytask?id='+ task._id" v-if="task.currStatus == 'done'">
          <b-button size="sm" variant="success">
            Оплатить
          </b-button>
        </router-link>
      </router-link>

      <h3>Ваши задания для выполнения</h3>
      <div v-if="data.userActiveTasks.length == 0"><p>Здесь пока пусто</p></div>
      <router-link class="task a-shadow a-shadow-hov" :to="'/task?id='+ task._id" v-for="task of data.userActiveTasks" :key="task._id" v-else>
          <div class="jc-btw">
            
          <p>{{task.taskInfo}}</p>
            <div class="task-price">
              
              {{task.price}} руб.
            </div>
          </div>
          <router-link :to="'/sendtask?id='+ task._id">
            <b-button variant="warning" size="sm">Завершить</b-button>
          </router-link>
      </router-link>

      <h3>Отзывы о Вас</h3>
      <div v-if="data.comments.length == 0"><p>Здесь пока пусто</p></div>
      <div class="task a-shadow" v-for="comment of data.comments" :key="comment._id" v-else>
        <div class="jc-btw">
          <user-link :login="comment.authorLogin" :fullPath="true"></user-link>
        </div>
        <p>{{comment.text}}</p>

      </div>

      <h3>История Баланса</h3>
        <div class="jc-btw">
          <h5 class="d-flex" style="align-items: center;">
            Текущий баланс:
            <div class="task-price ml-2">
              {{data.balance}} руб.
            </div>
          </h5>
          <b-button class="mb-3" v-b-modal.inc-balance variant="success">Пополнить баланс</b-button>
        </div>
        
        <b-modal id="inc-balance" title="Пополнить баланс" hide-footer>
          <div class="jc-btw">
            <b-form-input style="width: 150px;" v-model="incBalance" placeholder="Укажите сумму" type="number"></b-form-input>
            <b-button variant="success" @click="addBalance()">Пополнить</b-button>
          </div>
          
        </b-modal>
        <div class="tran mb-2 jc-btw a-shadow" v-for="(tran, i) of data.userTransactions" :key="i">
          <div class="d-flex">
            <p>{{getLogin == tran.fromLogin ? 'Вы перевели ' : 'Вам перевел '}}</p>
            <user-link class="ml-2 mr-2" :login="tran.toLogin" :fullPath="true" v-if="getLogin == tran.fromLogin"></user-link>
            <user-link class="ml-2 mr-2" :login="tran.fromLogin" :fullPath="true" v-else></user-link>
          </div>
          <div class="task-price">
            {{tran.value}} руб.
          </div>
        </div>
        
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
  data: () => ({
    data: null,
    incBalance: 0
  }),
  components: {
    UserLink: () => import('@/components/UserLink.vue')
  },
  computed: {

    ...mapGetters(['getLogin'])
    },
  created() {
    this.$api.getProfile({login: this.getLogin}).then(({data}) => {
      this.data = data
    })
  },
  methods: {
    addBalance() {
      this.$api.addBalance({bal: this.incBalance, login: this.getLogin})
      this.data.balance += +this.incBalance
      this.incBalance = 0
      this.$bvModal.hide('inc-balance')
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
.tran {
  padding: 5px 10px;
  margin-bottom: 2px;
  width: 100%;
  display: flex;
  align-items: center;
}
p {
  margin: 0;
}
.waiting {
  background: gray;
}
.in-progress {
  background: yellow;
}
.done {
  background: green;
}
.finished {
  background: darkgreen;
}
</style>