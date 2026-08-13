import { createRouter, createWebHistory } from 'vue-router'

import AuthCard from '../components/AuthCard.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthCard
    },

    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },

    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },

    {
      path: '/home',
      name: 'user-home',
      component: Home
    }
  ]
})

export default router