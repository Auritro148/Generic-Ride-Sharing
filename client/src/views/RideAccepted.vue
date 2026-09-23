<template>
  <div class="accepted-page">

    <nav class="navbar">

      <div class="logo">
        <div class="logo-mark">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="logo-text">
          Rooda
        </span>
      </div>

    </nav>


    <main class="accepted-content">

      <div class="accepted-card">

        <div class="success-icon">
          ✓
        </div>

        <p class="eyebrow">
          Ride confirmed
        </p>

        <h1>
          Your driver accepted the ride
        </h1>

        <p class="description">
          Your driver is on the way to your pickup location.
        </p>


        <div
          v-if="ride"
          class="ride-info"
        >

          <div class="info-row">
            <span>Driver</span>

            <strong>
              {{ ride.driverName || 'Driver' }}
            </strong>
          </div>

          <div class="info-row">
            <span>Vehicle</span>

            <strong>
              {{ ride.vehicle || 'Vehicle' }}
            </strong>
          </div>

          <div class="info-row">
            <span>Status</span>

            <strong class="accepted">
              Accepted
            </strong>
          </div>

        </div>


        <button
          class="cancel-button"
          type="button"
          :disabled="cancelLoading"
          @click="cancelRide"
        >
          {{
            cancelLoading
              ? 'Cancelling...'
              : 'Cancel Ride'
          }}
        </button>


        <button
          class="home-button"
          type="button"
          @click="goHome"
        >
          Back to Home
        </button>


        <p
          v-if="message"
          class="message"
        >
          {{ message }}
        </p>

      </div>

    </main>

  </div>
</template>


<script setup>

import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

import {
  useRouter,
  useRoute
} from 'vue-router'


const router = useRouter()
const route = useRoute()


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'


const rideId =
  route.params.rideId


const ride =
  ref(null)

const cancelLoading =
  ref(false)

const message =
  ref('')

let socket = null


const authHeaders = () => {

  const token =
    localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

}


const loadRide = async () => {

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/rides/${rideId}`,
        {
          headers:
            authHeaders()
        }
      )


    const data =
      await response.json()


    if (!response.ok) {
      throw new Error(
        data.message ||
        'Could not load ride.'
      )
    }


    ride.value =
      data.ride ||
      data.data ||
      data

  } catch (error) {

    console.error(
      'Ride loading error:',
      error
    )

  }

}


const cancelRide = async () => {

  cancelLoading.value = true

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/rides/${rideId}/cancel`,
        {
          method: 'POST',
          headers:
            authHeaders()
        }
      )


    const data =
      await response.json()
        .catch(() => ({}))


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Unable to cancel ride.'
      )

    }


    if (socket) {
      socket.close()
    }


    router.replace('/home')

  } catch (error) {

    message.value =
      error.message ||
      'Unable to cancel ride.'

  } finally {

    cancelLoading.value = false

  }

}


const goHome = () => {

  router.push('/home')

}


onMounted(() => {

  loadRide()

})


onBeforeUnmount(() => {

  if (socket) {
    socket.close()
  }

})

</script>


<style scoped>

* {
  box-sizing: border-box;
}

.accepted-page {
  min-height: 100vh;
  background: #f6f8f6;
}

.navbar {
  height: 72px;
  padding: 0 45px;
  display: flex;
  align-items: center;
  background: white;
  border-bottom: 1px solid #eee;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 25px;
  height: 25px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
}

.logo-mark span {
  background: #20df4f;
  border-radius: 4px;
}

.logo-text {
  font-size: 21px;
  font-weight: 800;
}

.accepted-content {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.accepted-card {
  width: min(470px, 100%);
  padding: 45px 40px;
  background: white;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 18px 55px rgba(0, 0, 0, .08);
}

.success-icon {
  width: 75px;
  height: 75px;
  margin: 0 auto 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e9f9ec;
  color: #159b36;
  font-size: 34px;
  font-weight: 800;
}

.eyebrow {
  margin: 0 0 8px;
  color: #159b36;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

h1 {
  margin: 0;
  font-size: 28px;
}

.description {
  color: #777;
  font-size: 13px;
  line-height: 1.6;
}

.ride-info {
  margin-top: 25px;
  padding: 16px;
  border-radius: 13px;
  background: #f7f8f7;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 9px 0;
  font-size: 12px;
}

.info-row span {
  color: #777;
}

.info-row strong {
  color: #222;
}

.info-row strong.accepted {
  color: #159b36;
}

.cancel-button,
.home-button {
  width: 100%;
  height: 48px;
  margin-top: 18px;
  border-radius: 11px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-button {
  border: 0;
  background: #111;
  color: white;
}

.cancel-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.home-button {
  border: 1px solid #ddd;
  background: white;
}

.message {
  margin-top: 12px;
  color: #c33;
  font-size: 11px;
}

</style>