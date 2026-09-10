import { createRouter, createWebHistory } from 'vue-router'

import AuthCard from '../components/AuthCard.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import Home from '../views/Home.vue'
import RideRequest from "../views/RideRequest.vue";

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
      component: Home,
      meta: { requiresAuth: true }
    },

    {
      path: "/ride-request",
      name: "RideRequest",
      component: Home,
      meta: { requiresAuth: true }
    },

    {
      path: "/profile",
      name: "Profile",
      component: AuthCard,
      meta: {requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/signin')
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return next({
          path: '/signin',
          query: { expired: 'true' }
        })
      }

      next()
    } catch (error) {
      localStorage.removeItem('token')
      next('/signin')
    }
  } else {
    next()
  }
})

export default router