import axios from 'axios'
import store from '../store'
import router from '../router'

axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/jsoncharset=UTF-8'

const instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/jsoncharset=UTF-8'

axios.interceptors.request.use = instance.interceptors.request.use

instance.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`.replace(/(^")|("$)/g, '')
    }
    return config
  },
  error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch('UserLogout')
          router.replace({
            path: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
      }
    }
    return Promise.reject(error.response)
})  
const url = 'http://localhost:3000'
export default {
  UserAdd (data) {
    return instance.post(url + '/api/useradd', data)
  },
  UserLogin (data) {
    return instance.post(url + '/api/login', data)
  },
  GetUser (data) {
    console.log(data);
    return instance.post(url + '/api/user', data)
  },
  GetTasks () {
    return instance.get(url + '/api/task')
  },
  getTaskById(data) {
    return instance.post(url + '/api/task', data)
  },
  getProfile (data) {
    return instance.post(url + '/api/profile', data)
  },
  addTask(data) {
    return instance.post(url + '/api/addtask', data)
  },
  sendTask(data) {
    return instance.post(url + '/api/sendtask', data)
  },
  payTask(data) {
    return instance.post(url + '/api/paytask', data)
  },
  addBalance(data) {
    return instance.post(url + '/api/addbalance', data)
  },
  acceptRespond(data) {
    return instance.post(url + '/api/acceptrespond', data)
  },
  respondTask(data) {
    return instance.post(url + '/api/respondtask', data)
  },
  getDb() {
    return instance.get(url + '/api/db')
  },
  refreshDb(data) {
    return instance.post(url + '/api/refreshdb', data)
  }
}
