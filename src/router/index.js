import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/user/:id',
      component: () => import('../views/User.vue'),
      meta: {
        requireAuth: true
      }
    }, 
    { 
      path: '/addtask',
      component: () => import('../views/AddTask.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/task',
      props: (route) => ({ taskId: route.query.id }),
      component: () => import('../views/Task.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/sendtask',
      props: (route) => ({ taskId: route.query.id }),
      component: () => import('../views/SendTask.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/paytask',
      props: (route) => ({ taskId: route.query.id }),
      component: () => import('../views/PayTask.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/profile',
      component: () => import('../views/Profile.vue'),
      meta: {
        requireAuth: true
      }
    },
    { 
      path: '/db',
      component: () => import('../views/Db.vue'),
      meta: {
        requireAuth: true
      }
    },
  ]
})

if (sessionStorage.getItem('token')) {
  store.commit('login', sessionStorage.getItem('token'))
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      if (to.params.id == store.state.login) {
        next({
          path: '/profile',
        })
      }
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else if (store.state.token) {
      next({
        path: '/home',
        query: {
          redirect: to.fullPath
        }
      })
  } else next()
})

router.push
export default router
