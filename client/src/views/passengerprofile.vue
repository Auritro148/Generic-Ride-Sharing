```vue
<template>
  <div class="profile-page">

    <!-- NAVBAR -->
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


      <div class="nav-links">
        <a href="#" @click.prevent="goHome">Home</a>
        <a href="#">About us</a>
        <a href="#">Why Rooda</a>
        <a href="#">Blog</a>
        <a href="#">Vehicles</a>
      </div>


      <div class="profile-area">
        <button
          class="profile-button"
          type="button"
        >
          <span class="profile-avatar">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 12a4.5 4.5 0 1 0 0-9
                   4.5 4.5 0 0 0 0 9Zm0 2
                   c-4.42 0-8 2.24-8 5v2h16v-2
                   c0-2.76-3.58-5-8-5Z"
              />
            </svg>
          </span>

          <span class="profile-name">
            {{ fullName }}
          </span>
        </button>
      </div>

    </nav>


    <!-- PAGE CONTENT -->
    <main class="page-content">

      <section class="profile-header">
        <p class="eyebrow">
          Rooda account
        </p>

        <h1>
          My Profile
        </h1>

        <p>
          Manage your personal information and account.
        </p>
      </section>


      <!-- PROFILE CARD -->
      <section class="profile-card">

        <!-- PROFILE TOP -->
        <div class="profile-top">

          <div class="large-avatar">

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 12a4.5 4.5 0 1 0 0-9
                   4.5 4.5 0 0 0 0 9Zm0 2
                   c-4.42 0-8 2.24-8 5v2h16v-2
                   c0-2.76-3.58-5-8-5Z"
              />
            </svg>

          </div>


          <div class="profile-heading">

            <h2>
              {{ fullName }}
            </h2>

            <span class="account-type">
              Passenger
            </span>

          </div>

        </div>


        <!-- PROFILE INFORMATION -->
        <div class="info-section">

          <h3>
            Personal information
          </h3>


          <div class="info-grid">

            <!-- NAME -->
            <div class="info-item">

              <span class="info-label">
                Full name
              </span>

              <strong>
                {{ fullName }}
              </strong>

            </div>


            <!-- PHONE -->
            <div class="info-item">

              <span class="info-label">
                Phone number
              </span>

              <strong>
                {{ user.phone || 'Not available' }}
              </strong>

            </div>


            <!-- EMAIL -->
            <div class="info-item">

              <span class="info-label">
                Email
              </span>

              <strong>
                {{ user.email || 'Not available' }}
              </strong>

            </div>


            <!-- ACCOUNT TYPE -->
            <div class="info-item">

              <span class="info-label">
                Account type
              </span>

              <strong>
                Passenger
              </strong>

            </div>

          </div>

        </div>


        <!-- ACCOUNT ACTIONS -->
        <div class="actions-section">

          <h3>
            Account
          </h3>


          <div class="action-list">

            <!-- TRIP HISTORY -->
            <button
              type="button"
              class="action-card"
              @click="goToTripHistory"
            >

              <div class="action-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 7v5l3.5 2
                       M21 12a9 9 0 1 1-3-6.7
                       M21 4v5h-5"
                  />
                </svg>
              </div>

              <div class="action-content">

                <strong>
                  Trip history
                </strong>

                <small>
                  View your previous rides
                </small>

              </div>

              <span class="action-arrow">
                →
              </span>

            </button>


            <!-- UPDATE PROFILE -->
            <button
              type="button"
              class="action-card"
              @click="goToUpdateProfile"
            >

              <div class="action-icon">

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 20h9
                       M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1
                       1-4L16.5 3.5Z"
                  />
                </svg>

              </div>

              <div class="action-content">

                <strong>
                  Update profile
                </strong>

                <small>
                  Change your personal information
                </small>

              </div>

              <span class="action-arrow">
                →
              </span>

            </button>


            <!-- CHANGE PASSWORD -->
            <button
              type="button"
              class="action-card"
              @click="goToChangePassword"
            >

              <div class="action-icon">

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />

                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                  />

                  <circle
                    cx="12"
                    cy="15"
                    r="1"
                  />
                </svg>

              </div>

              <div class="action-content">

                <strong>
                  Change password
                </strong>

                <small>
                  Update your account password
                </small>

              </div>

              <span class="action-arrow">
                →
              </span>

            </button>

          </div>

        </div>


        <!-- MESSAGE -->
        <div
          v-if="message"
          class="message"
          :class="messageType"
        >
          {{ message }}
        </div>


        <!-- BACK BUTTON -->
        <button
          type="button"
          class="back-button"
          @click="goHome"
        >
          <span>←</span>
          Back to home
        </button>

      </section>

    </main>

  </div>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'


/* =========================================================
   USER
========================================================= */

const user = ref({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  user_type: 'passenger'
})


const fullName = computed(() => {

  const firstName =
    user.value.first_name?.trim() || ''

  const lastName =
    user.value.last_name?.trim() || ''

  const name =
    `${firstName} ${lastName}`.trim()

  return name || 'User'
})


/* =========================================================
   MESSAGE
========================================================= */

const message = ref('')
const messageType = ref('success')


/* =========================================================
   AUTH HEADERS
========================================================= */

const authHeaders = () => {

  const token =
    localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}


/* =========================================================
   LOAD PROFILE
========================================================= */

const loadProfile = async () => {

  const token =
    localStorage.getItem('token')


  if (!token) {

    router.push('/signin')

    return
  }


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/user/profile`,
        {
          method: 'GET',

          headers:
            authHeaders()
        }
      )


    const data =
      await response.json()
        .catch(() => ({}))


    if (response.status === 401) {

      localStorage.clear()

      router.push('/signin')

      return
    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Failed to load profile'
      )
    }


    user.value = {

      first_name:
        data.first_name || '',

      last_name:
        data.last_name || '',

      phone:
        data.phone || '',

      email:
        data.email || '',

      user_type:
        data.user_type || 'passenger'

    }


    localStorage.setItem(
      'user_name',
      fullName.value
    )


  } catch (error) {

    console.error(
      'Profile loading error:',
      error
    )


    showMessage(
      error.message ||
      'Could not load profile.',
      'error'
    )

  }

}


/* =========================================================
   NAVIGATION
========================================================= */

const goHome = () => {

  router.push('/home')

}


const goToTripHistory = () => {

  router.push('/trip-history')

}


const goToUpdateProfile = () => {

  router.push('/profile/update')

}


const goToChangePassword = () => {

  router.push('/change-password')

}


/* =========================================================
   MESSAGE
========================================================= */

let messageTimer = null


const showMessage = (
  text,
  type = 'success'
) => {

  message.value = text

  messageType.value = type


  clearTimeout(
    messageTimer
  )


  messageTimer =
    setTimeout(() => {

      message.value = ''

    }, 4000)

}


/* =========================================================
   LIFECYCLE
========================================================= */

onMounted(() => {

  loadProfile()

})

</script>


<style scoped>

:global(*) {
  box-sizing: border-box;
}


:global(body) {
  margin: 0;

  font-family:
    Inter,
    Arial,
    sans-serif;
}


/* =========================================================
   PAGE
========================================================= */

.profile-page {

  min-height: 100vh;
  min-width: 100vw;

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f4f7f4
    );

  color: #111;
}


/* =========================================================
   NAVBAR
========================================================= */

.navbar {

  height: 82px;

  padding: 0 5%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background:
    rgba(255,255,255,.92);

  border-bottom:
    1px solid #e7e9e7;

  position: sticky;

  top: 0;

  z-index: 100;
}


.logo {

  display: flex;

  align-items: center;

  gap: 10px;
}


.logo-text {

  font-size: 30px;

  font-weight: 750;
}


.logo-mark {

  width: 31px;

  height: 31px;

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 3px;
}


.logo-mark span {

  background:
    #20df4f;

  border-radius: 50%;
}


.nav-links {

  display: flex;

  gap: 30px;
}


.nav-links a {

  color: #555;

  text-decoration: none;

  font-size: 14px;
}


.nav-links a:hover {

  color: #159b36;
}


/* =========================================================
   PROFILE NAV
========================================================= */

.profile-area {

  position: relative;
}


.profile-button {

  border: 0;

  background: transparent;

  display: flex;

  align-items: center;

  gap: 9px;

  cursor: pointer;
}


.profile-avatar {

  width: 36px;

  height: 36px;

  border-radius: 50%;

  display: grid;

  place-items: center;

  background: #20df4f;
}


.profile-avatar svg {

  width: 21px;

  height: 21px;

  fill: #111;
}


.profile-name {

  font-size: 13px;

  font-weight: 650;
}


/* =========================================================
   CONTENT
========================================================= */

.page-content {

  width:
    min(
      850px,
      calc(100% - 48px)
    );

  margin: 0 auto;

  padding: 50px 0;
}


.profile-header {

  margin-bottom: 28px;
}


.eyebrow {

  margin:
    0 0 8px;

  color: #159b36;

  font-size: 12px;

  font-weight: 750;

  text-transform:
    uppercase;

  letter-spacing: 1px;
}


.profile-header h1 {

  margin: 0;

  font-size: 38px;

  letter-spacing: -1.5px;
}


.profile-header p:last-child {

  color: #777;

  margin-top: 10px;
}


/* =========================================================
   PROFILE CARD
========================================================= */

.profile-card {

  background: white;

  border-radius: 22px;

  padding: 32px;

  box-shadow:
    0 18px 55px
    rgba(0,0,0,.09);
}


/* =========================================================
   PROFILE TOP
========================================================= */

.profile-top {

  display: flex;

  align-items: center;

  gap: 20px;

  padding-bottom: 28px;

  border-bottom:
    1px solid #eeeeee;
}


.large-avatar {

  width: 92px;

  height: 92px;

  flex-shrink: 0;

  border-radius: 50%;

  display: grid;

  place-items: center;

  background:
    #20df4f;
}


.large-avatar svg {

  width: 52px;

  height: 52px;

  fill: #111;
}


.profile-heading h2 {

  margin: 0;

  font-size: 25px;
}


.account-type {

  display: inline-block;

  margin-top: 8px;

  padding: 5px 10px;

  border-radius: 20px;

  background: #edfaef;

  color: #159b36;

  font-size: 10px;

  font-weight: 750;

  text-transform: uppercase;

  letter-spacing: .6px;
}


/* =========================================================
   INFO
========================================================= */

.info-section {

  padding:
    28px 0;
}


.info-section h3,
.actions-section h3 {

  margin: 0 0 15px;

  font-size: 15px;
}


.info-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 12px;
}


.info-item {

  padding: 17px;

  border:
    1px solid #e5e8e5;

  border-radius: 12px;

  background: #fafcfa;
}


.info-label {

  display: block;

  margin-bottom: 7px;

  color: #888;

  font-size: 10px;

  font-weight: 650;

  text-transform: uppercase;

  letter-spacing: .5px;
}


.info-item strong {

  display: block;

  font-size: 13px;

  word-break: break-word;
}


/* =========================================================
   ACTIONS
========================================================= */

.actions-section {

  padding-top: 5px;
}


.action-list {

  display: flex;

  flex-direction: column;

  gap: 10px;
}


.action-card {

  width: 100%;

  min-height: 72px;

  padding: 12px 15px;

  display: flex;

  align-items: center;

  gap: 13px;

  border:
    1px solid #e2e5e2;

  background: white;

  border-radius: 13px;

  cursor: pointer;

  text-align: left;

  transition:
    border-color .2s,
    background .2s;
}


.action-card:hover {

  border-color:
    #20df4f;

  background:
    #f7fff8;
}


.action-icon {

  width: 43px;

  height: 43px;

  flex-shrink: 0;

  display: grid;

  place-items: center;

  border-radius: 11px;

  background:
    #edf7ef;

  color:
    #159b36;
}


.action-icon svg {

  width: 21px;

  height: 21px;

  fill: none;

  stroke: currentColor;

  stroke-width: 1.8;

  stroke-linecap: round;

  stroke-linejoin: round;
}


.action-content {

  flex: 1;

  min-width: 0;
}


.action-content strong {

  display: block;

  font-size: 13px;
}


.action-content small {

  display: block;

  margin-top: 4px;

  color: #888;

  font-size: 10px;
}


.action-arrow {

  color: #777;

  font-size: 18px;

  padding-left: 8px;
}


/* =========================================================
   MESSAGE
========================================================= */

.message {

  margin-top: 15px;

  padding: 11px;

  border-radius: 9px;

  font-size: 11px;
}


.message.success {

  background: #edfaef;

  color: #159b36;
}


.message.error {

  background: #fff0f0;

  color: #c33;
}


/* =========================================================
   BACK BUTTON
========================================================= */

.back-button {

  width: 100%;

  height: 48px;

  margin-top: 22px;

  border:
    1px solid #ddd;

  border-radius: 11px;

  background: white;

  color: #444;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;
}


.back-button:hover {

  border-color:
    #20df4f;

  color:
    #159b36;

  background:
    #f7fff8;
}


.back-button span {

  margin-right: 7px;

  font-size: 16px;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 700px) {

  .nav-links {

    display: none;
  }


  .navbar {

    padding: 0 20px;
  }


  .profile-name {

    display: none;
  }


  .page-content {

    width:
      calc(100% - 28px);

    padding:
      30px 0;
  }


  .profile-card {

    padding: 22px;
  }


  .profile-header h1 {

    font-size: 30px;
  }


  .info-grid {

    grid-template-columns:
      1fr;
  }


  .large-avatar {

    width: 75px;

    height: 75px;
  }


  .large-avatar svg {

    width: 43px;

    height: 43px;
  }


  .profile-heading h2 {

    font-size: 21px;
  }

}

</style>
```
