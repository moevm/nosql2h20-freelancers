<template>
  <div v-if="getLogin=='admin'">

      <b-button-group style="display: flex; justify-content: center;">
        <b-button variant="success" @click="state=0">скачивание/импорт</b-button>
        <b-button variant="info" @click="state=1">список</b-button>
        <b-button variant="warning" @click="state=2">статистика</b-button>
      </b-button-group>

    
    <div v-if="state==0">
      <h3 style="text-align:center;">База данных сервиса</h3>
      <b-col style="padding: 0 20%;">

        <a><b-button class="mb-3" variant="outline-primary" size="lg" @click="saveDb()">Скачать</b-button></a>
        <a><b-button variant="outline-primary" size="lg" @click="importDb()">Импортировать в сервис</b-button></a>
        <b-form-file v-model="file" id="input-file" accept=".json" v-show="false"></b-form-file>
      </b-col>
    </div>
    
    <div v-else-if="state==1">
      <h3 style="text-align:center;">База данных в виде списков</h3>
      <div style="display: flex;" v-if="!!data">
        <b-col cols="3">
          <h5 style="text-align:center;">Коллекция Users</h5>
          <b-row class="input-search-wrap">
            <b-form-select class="input-search" v-model="user.field" :options="user.fields" size="sm"></b-form-select>
            <b-form-input class="input-search" v-model="user.search"></b-form-input>
          </b-row>
          <div class="wrap-f">
            <div class="a-shadow" v-for="u of filter('user')" :key="u._id">
              <p><b>login:</b> {{u.login}}</p>
              <p><b>password:</b> {{u.password}}</p>
              <p><b>fio:</b> {{u.fio}}</p>
              <p><b>balance:</b> {{u.balance}}</p>
            </div>
          </div>
        </b-col>

        <b-col cols="3">
          <h5 style="text-align:center;">Коллекция Tasks</h5>
          <b-row class="input-search-wrap">
            <b-form-select class="input-search" v-model="tasks.field" :options="tasks.fields" size="sm" ></b-form-select>
            <b-form-input class="input-search" v-model="tasks.search"></b-form-input>
          </b-row>
          <div class="wrap-f">
            <div class="a-shadow" v-for="t of filter('tasks')" :key="t._id">
              <p><b>workerLogin:</b> {{t.workerLogin}}</p>
              <p><b>employerLogin:</b> {{t.employerLogin}}</p>
              <p><b>currStatus:</b> {{t.currStatus}}</p>
              <p><b>taskInfo:</b> {{t.taskInfo}}</p>
              <p><b>creationDate:</b> {{t.creationDate}}</p>
              <p><b>finishDate:</b> {{t.finishDate}}</p>
              <p><b>price:</b> {{t.price}}</p>
              <p><b>solutionLink:</b> {{t.solutionLink}}</p>
              <p><b>type:</b> {{t.type}}</p>
              <p><b>applicantsList:</b> {{t.applicantsList}}</p>
            </div>
          </div>
          
        </b-col>

        <b-col cols="3">
          <h5 style="text-align:center;">Коллекция Transactions</h5>
          <b-row class="input-search-wrap">
            <b-form-select class="input-search" v-model="transaction.field" :options="transaction.fields" size="sm"></b-form-select>
            <b-form-input class="input-search" v-model="transaction.search"></b-form-input>
          </b-row>
          <div class="wrap-f">
            <div class="a-shadow" v-for="tr of filter('transaction')" :key="tr._id">
              <p><b>fromLogin:</b> {{tr.fromLogin}}</p>
              <p><b>toLogin:</b> {{tr.toLogin}}</p>
              <p><b>value:</b> {{tr.value}}</p>
            </div>
          </div>
        </b-col>

        <b-col cols="3">
          <h5 style="text-align:center;">Коллекция Comments</h5>
          <b-row class="input-search-wrap">
            <b-form-select class="input-search" v-model="comments.field" :options="comments.fields" size="sm"></b-form-select>
            <b-form-input class="input-search" v-model="comments.search"></b-form-input>
          </b-row>
          <div class="wrap-f">
            <div class="a-shadow" v-for="c of filter('comments')" :key="c._id">
              <p><b>ownerLogin:</b> {{c.ownerLogin}}</p>
              <p><b>authorLogin:</b> {{c.authorLogin}}</p>
              <p><b>text:</b> {{c.text}}</p>
            </div>
          </div>
        </b-col>
        
      </div>
    </div>
    
    <div v-else-if="state==2">
      <h3 style="text-align:center;">Статистика</h3>
      <b-col class="pl-3 pr-3">
        <b-table outlined bordered :items="items" :fields="fields">
          <template #table-caption>Кол-во сущностей</template>
        </b-table>
      </b-col>
      <h5 class="mt-5" style="text-align:center;">Все задания в сервисе по их статусу</h5>
      <MyDoughnut v-if="!!chartTask.chartdata && !!chartTask.options" :chartData="chartTask.chartdata" :options="chartTask.options"></MyDoughnut>
      <h5 class="mt-5" style="text-align:center;">Пользователи с заданиями (их статус)</h5>
      <MyBar class="mt-3" v-if="!!chartUser.chartdata && !!chartUser.options" :chartData="chartUser.chartdata" :options="chartUser.options"></MyBar>
    </div>
    
  </div>

  <div v-else>
    Только администратор может просматривать эту страницу.
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
  components: {
    MyBar: () => import('@/components/MyBar.js'),
    MyDoughnut: () => import('@/components/MyDoughnut.js')
  },
  data: () => ({
    state: 0,
    data: null,
    file: null,
    comments: {
      search: '',
      field: 'ownerLogin',
      fields: [{ value: 'ownerLogin', text: 'ownerLogin' }, { value: 'authorLogin', text: 'authorLogin' }, { value: 'text', text: 'text' }]
    },
    user: {
      search: '',
      field: 'login',
      fields: [{ value: 'login', text: 'login' }, { value: 'password', text: 'password' }, { value: 'fio', text: 'fio' }, { value: 'balance', text: 'balance' }]
    },
    tasks: {
      search: '',
      field: 'workerLogin',
      fields: [{ value: 'workerLogin', text: 'workerLogin' }, { value: 'employerLogin', text: 'employerLogin' }, { value: 'currStatus', text: 'currStatus' }, { value: 'taskInfo', text: 'taskInfo' }, { value: 'creationDate', text: 'creationDate' }, { value: 'finishDate', text: 'finishDate' }, { value: 'price', text: 'price' }, { value: 'solutionLink', text: 'solutionLink' }, { value: 'type', text: 'type' }, { value: 'applicantsList', text: 'applicantsList' }]
    },
    transaction: {
      search: '',
      field: 'fromLogin',
      fields: [{ value: 'fromLogin', text: 'fromLogin' }, { value: 'toLogin', text: 'toLogin' }, { value: 'value', text: 'value' }]
    },
    fields: [
      {
        key: 'user',
        label: 'Пользователи',
      },
      {
        key: 'task',
        label: 'Задания',
      },
      {
        key: 'comment',
        label: 'Отзывы',
      },
      {
        key: 'transaction',
        label: 'Транзакции',
      }
    ],
    items:[],
    chartTask: {
      chartdata: null,
      options: null
    },
    chartUser: {
      chartdata: null,
      options: null
    }

  }),
  created() {
    this.$api.getDb().then(({data}) => {
      this.data = data
      this.data.user.forEach(u => u.password = this.decrypt(u.password))
      this.items.push({user: data.user.length, task: data.tasks.length, comment: data.comments.length, transaction: data.transaction.length})
      this.createChartTask()
      this.createChartUser()
    })
  },
  computed: {
    ...mapGetters(['getLogin'])
  },
  watch: {
    file() {
      const blob = new Blob([this.file], {type:"application/json"});
      const fr = new FileReader();
      fr.addEventListener("load", () => {
        this.$api.refreshDb(JSON.parse(fr.result))
      })
      fr.readAsText(blob);
    }
  },
  methods: {
    filter(name) {
      return !!this.data ? this.data[name].filter(o => o[this[name].field].toString().toLowerCase().includes(this[name].search.toLowerCase())) : []
    },
    saveDb() {
      const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = "db.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    importDb() {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      document.getElementById('input-file').dispatchEvent(e);
    },
    decrypt(text) {
      const crypto = require('crypto');
      let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.data.key), new Uint16Array(this.data.iv.data));
      let decrypted = decipher.update(Buffer.from(text, 'hex'));

      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    },
    createChartUser() {
      const m = new Map()

      this.data.user.forEach(u => {
        m.set(u.login, {
          paid: 0,
          created: 0,
          did: 0,
          doing: 0,
          will: 0
        })
      })

      this.data.tasks.forEach(t => {
        const empl = t.employerLogin

        let nv = m.get(empl)
        nv.created += 1
        m.set(empl, nv)

        if (t.currStatus == 'finished') {
          let nv = m.get(empl)
          nv.paid += 1
          m.set(empl, nv)
        }

        const wrkl = t.workerLogin
        if ((t.currStatus == 'finished' || t.finished == 'done')) {
          let nv = m.get(wrkl)
          nv.did += 1
          m.set(wrkl, nv)
        }
        if (t.currStatus == 'in-progress') {
          let nv = m.get(wrkl)
          nv.doing += 1
          m.set(wrkl, nv)
        }

        t.applicantsList.forEach(u => {
          let nv = m.get(u)
          nv.will += 1
          m.set(u, nv)
        })
      })

      const result = Array.from(m.entries())
      const ds = []
      ds.push({
        label: 'Отклики на чужие задачи',
        backgroundColor: '#17a2b8',
        data: result.map(r => r[1].will)
      })
      ds.push({
        label: 'Выполняет чужие задачи',
        backgroundColor: '#ebfc03',
        data: result.map(r => r[1].doing)
      })
      ds.push({
        label: 'Создал свои задачи',
        backgroundColor: '#03fc17',
        data: result.map(r => r[1].created)
      })
      ds.push({
        label: 'Оплатил за выполненные его задачи',
        backgroundColor: '#f57a38',
        data: result.map(r => r[1].paid)
      })
      ds.push({
        label: 'Завершил задачи',
        backgroundColor: '#000000',
        data: result.map(r => r[1].did)
      })
      this.chartUser.chartdata = {
        labels: result.map(r => r[0]),
        datasets: ds
      }
      this.chartUser.options = {
        scales: {
          yAxes:[{
            stacked: true,
            ticks: {
              min: 0,
              callback: function(value, index, values) {
                  if (Math.floor(value) === value) {
                      return value;
                  }
              }
            }
          }],
          xAxes:[{
            stacked: true,
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    },
    createChartTask() {
      let done = 0
      let finished = 0
      let inprg = 0
      let waiting = 0
      this.data.tasks.forEach(t => {
        if (t.currStatus == 'waiting') waiting += 1
        else if (t.currStatus == 'done') done += 1
        else if (t.currStatus == 'in-progress') inprg += 1
        else if (t.currStatus == 'finished') finished += 1
      })
      this.chartTask.chartdata = {
        labels: ['В ожидании выполнения', 'Выполняются', 'Завершенные', 'Завершенные и оплачены'],
        datasets: [
          {
            label: 'В ожидании фрилансера',
            data: [waiting, inprg, done, finished],
            backgroundColor: ['#17a2b8', '#ebfc03', '#454545', '#000000']
          }
        ]
      }
      this.chartTask.options = {
        responsive: true,
        maintainAspectRatio: false
      }
    }
    
  }
}
</script>

<style scoped>
p {
  margin: 0;
}
h3 {
  margin-top: 15px;
}
.a-shadow {
  padding: 5px;
  margin-bottom: 7px;
}
a, button {
  display: block;
  width: 100%;
}
.input-search-wrap {
  margin: 5px 0 10px;
  justify-content: space-between;
  align-items: center;
}
.input-search {
  max-height: 30px;
  width: 45%;
}
.wrap-f {
  overflow: hidden;
  overflow-y: auto;
  padding: 2px;
  height: calc(100vh - 270px);
}
</style>