import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token'),
    login: sessionStorage.getItem('login')
  },
  getters: {
    getLogin(state) {
      return state.login
    }
  },
  mutations: {
    login: (state, data) => {
      try {
        sessionStorage.setItem('token', data)
        state.token = data
      } catch (err) {
        console.log(err)
      }
    },
    logout: (state) => {
      try {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('login')
        state.login = null
        state.token = null
      } catch (err) {
        console.log(err)
      }
    },
    setLogin: (state, data) => {
      try {
        sessionStorage.setItem('login', data)
        state.login = data
      } catch (err) {
        console.log(err)
      }
    }
  },
  actions: {
    UserLogin ({commit}, data) {
      commit('login', data)
    },
    UserLogout ({commit}) {
      commit('logout')
    },
    UserSetLogin ({commit}, data) {
      commit('setLogin', data)
    }
  },
  modules: {
  }
})
