<template>
  <div class="searching-page">

    <nav class="navbar">
      <div class="logo">
        <div class="logo-mark">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="logo-text">Rooda</span>
      </div>
    </nav>

    <main class="searching-content">

      <div class="searching-card">

        <div class="loader">
          <div class="loader-ring"></div>
          <div class="loader-dot"></div>
        </div>

        <p class="eyebrow">
          Rooda ride
        </p>

        <h1>
          Searching for a driver
        </h1>

        <p class="description">
          We're looking for a nearby driver for your ride.
          Please wait a moment.
        </p>

        <div class="status-box">
          <span class="status-dot"></span>
          <span>Finding available drivers...</span>
        </div>

        <button
          class="cancel-button"
          type="button"
          :disabled="cancelLoading"
          @click="cancelRide"
        >
          {{ cancelLoading ? 'Cancelling...' : 'Cancel Ride' }}
        </button>

        <p
          v-if="message"
          class="message"
          :class="messageType"
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

const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  'ws://localhost:5000'


const rideId = route.params.rideId

const cancelLoading = ref(false)

const message = ref('')
const messageType = ref('error')

let socket = null


const authHeaders = () => {

  const token =
    localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}


const connectWebSocket = () => {

  if (!rideId) {
    message.value =
      'Ride information is missing.'

    return
  }

  socket =
    new WebSocket(
      `${WS_BASE_URL}/ws/rides/${rideId}`
    )


  socket.onopen = () => {

    console.log(
      'Ride WebSocket connected'
    )

  }


  socket.onmessage = event => {

    try {

      const data =
        JSON.parse(event.data)

      console.log(
        'WebSocket message:',
        data
      )


      if (
        data.type === 'ride_accepted' &&
        data.status === 'accepted'
      ) {

        router.replace({
          name: 'ride-accepted',
          params: {
            rideId
          },
          state: {
            ride: data.ride
          }
        })

      }


      if (
        data.type === 'ride_cancelled'
      ) {

        router.replace('/home')

      }

    } catch (error) {

      console.error(
        'WebSocket message error:',
        error
      )

    }

  }


  socket.onerror = error => {

    console.error(
      'Ride WebSocket error:',
      error
    )

  }


  socket.onclose = () => {

    console.log(
      'Ride WebSocket disconnected'
    )

  }

}


const cancelRide = async () => {

  if (!rideId) {
    return
  }

  cancelLoading.value = true

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/rides/${rideId}/cancel`,
        {
          method: 'POST',
          headers: authHeaders()
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

    console.error(
      'Cancel ride error:',
      error
    )

    message.value =
      error.message ||
      'Unable to cancel ride.'

    messageType.value =
      'error'

  } finally {

    cancelLoading.value = false

  }

}


onMounted(() => {

  connectWebSocket()

})


onBeforeUnmount(() => {

  if (socket) {
    socket.close()
    socket = null
  }

})

</script>


<style scoped>

* {
  box-sizing: border-box;
}

.searching-page {
  min-height: 100vh;
  background: #f6f8f6;
}

.navbar {
  height: 72px;
  padding: 0 45px;
  display: flex;
  align-items: center;
  background: white;
  border-bottom: 1px solid #eeeeee;
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

.searching-content {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.searching-card {
  width: min(470px, 100%);
  padding: 45px 40px;
  background: white;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 18px 55px rgba(0, 0, 0, .08);
}

.loader {
  width: 95px;
  height: 95px;
  margin: 0 auto 28px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-ring {
  position: absolute;
  inset: 0;
  border: 5px solid #e8f5ea;
  border-top-color: #20df4f;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.loader-dot {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #20df4f;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  font-size: 30px;
}

.description {
  margin: 13px auto 0;
  max-width: 350px;
  color: #777;
  font-size: 13px;
  line-height: 1.6;
}

.status-box {
  margin-top: 25px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #f4faf5;
  border-radius: 10px;
  color: #159b36;
  font-size: 12px;
  font-weight: 650;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #20df4f;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  50% {
    opacity: .35;
  }
}

.cancel-button {
  width: 100%;
  height: 48px;
  margin-top: 20px;
  border: 0;
  border-radius: 11px;
  background: #111;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.cancel-button:hover {
  background: #222;
}

.cancel-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.message {
  margin-top: 12px;
  font-size: 11px;
}

.message.error {
  color: #c33;
}

</style>