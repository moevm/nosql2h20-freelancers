<template>
<div class="container">
  <h2>Все задания</h2>
  <div class="filter jc-btw">
    <div class="d-flex" style="align-items: center;">
      <span>Тип:</span> <b-form-input class="finput" style="max-width: unset;" type="text" v-model="ftype"></b-form-input>
    </div>

    <div>
      Цена от <b-form-input class="finput" type="number" v-model="ffrom"></b-form-input>
      до <b-form-input class="finput" type="number" v-model="fto"></b-form-input>
    </div>
  </div>

  <router-link class="task a-shadow a-shadow-hov" :to="'/task?id='+ task._id" v-for="task of filteredTasks" :key="task._id.$oid">
      <div class="jc-btw">
        <user-link :login="task.employerLogin" :fullPath="true"></user-link>
        <div class="task-price">
          {{task.price}} руб.
        </div>
      </div>
      
      <p>{{task.taskInfo}}</p>
      <p>Тип: {{task.type}}</p>
  </router-link>
  <router-link class="mt-3 mb-3" to="addtask" style="display: flex;justify-content: center;"><b-button size="lg" variant="success">Создать новое задание</b-button></router-link>
</div>

</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      login: '',
      tasks: [],
      ftype: '',
      ffrom: 0,
      fto: 0,
      show: false
    }
  },
  components: {
    UserLink: () => import('@/components/UserLink.vue')
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(t => (t.type.toLowerCase().includes(this.ftype.trim().toLowerCase())) && t.price >= this.ffrom && t.price <= this.fto)
    }
  },
  created () {
    this.login = sessionStorage.getItem('login')
    this.$api.GetTasks()
      .then(data => {
        this.tasks = data.data
        this.tasks.forEach(t => {
          if (this.fto <= t.price) this.fto = +t.price
        })
      })
  },
  methods: {
    addTask() {
      this.show = true
    }
  }
}
</script>
<style scoped>
.finput {
  margin: 0 10px;
  display: inline;
  max-width: 100px;
}
.finput::-webkit-outer-spin-button,
.finput::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.filter {
  align-items: center;
  margin-bottom: 10px;
}
</style>