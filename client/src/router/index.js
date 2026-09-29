import { createRouter, createWebHistory } from 'vue-router'

import AuthCard from '../components/AuthCard.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import Home from '../views/Home.vue'
import PassengerProfile from "../views/passengerprofile.vue";
import rideSearching from '../views/RideSearching.vue';
import rideAccepted from '../views/RideAccepted.vue';
import driver from '../views/driver.vue';
import driversign from '../views/driversign.vue';
import UpdatePassengerProfile from'../views/UpdateProfile.vue';
import ChangePassword from '../views/ChangePassword.vue';
import DriverRegistration from '../views/DriverRegistration.vue'

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
      path: "/drivers",
      name: "RideRequest",
      component: driversign,
    },

    {
      path: "/profile",
      name: "Profile",
      component: AuthCard,
      meta: {requiresAuth: true }
    },

    {
      path: '/ride-searching/:rideId',
      name: 'ride-searching',
      component: rideSearching,
      meta: {requiresAuth: true }
    },

    {
      path: '/ride-accepted/:rideId',
      name: 'ride-accepted',
      component: rideAccepted

    },

    {
      path: '/driver',
      name: 'driverview',
      component: driver,
      meta: {requiresAuth: true }
    },

    {
      path: '/profile',
      name: 'Profile',
      component: PassengerProfile,
      meta: {requiresAuth: true }
    },

    {
      path: '/profile/update',
      name: 'Update Profile',
      component: UpdatePassengerProfile,
      meta: {requiresAuth: true }
    },

    {
      path: '/change-password',
      name: 'Change password',
      component: ChangePassword,
      meta: {requiresAuth: true }
    },

    {
      path: '/registerdriver',
      name: 'Driver registration',
      component: DriverRegistration,
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