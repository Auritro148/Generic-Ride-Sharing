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

        <span class="logo-text">
          Rooda
        </span>

      </div>


      <div class="nav-links">

        <a href="#" @click.prevent="goHome">
          Home
        </a>

        <a href="#">
          About us
        </a>

        <a href="#">
          Why Rooda
        </a>

        <a href="#">
          Blog
        </a>

        <a href="#">
          Vehicles
        </a>

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
          Change Password
        </h1>

        <p>
          Keep your account secure with a new password.
        </p>

      </section>


      <!-- PASSWORD CARD -->
      <section class="profile-card">

        <div class="profile-top">

          <div class="large-avatar">

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


          <div class="profile-heading">

            <h2>
              Change your password
            </h2>

            <span class="account-type">
              Passenger
            </span>

          </div>

        </div>


        <!-- PASSWORD FORM -->
        <form
          class="password-form"
          @submit.prevent="handleSubmit"
        >

          <!-- OLD PASSWORD -->
          <div class="form-group">

            <label for="oldPassword">
              Current password
            </label>

            <input
              id="oldPassword"
              v-model="oldPassword"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your current password"
              :disabled="checkingPassword || passwordVerified"
            />

          </div>


          <!-- VERIFY OLD PASSWORD -->
          <button
            v-if="!passwordVerified"
            type="button"
            class="verify-button"
            @click="verifyOldPassword"
            :disabled="checkingPassword || !oldPassword"
          >

            {{ checkingPassword
              ? 'Checking...'
              : 'Verify password'
            }}

          </button>


          <!-- NEW PASSWORD SECTION -->
          <div
            v-if="passwordVerified"
            class="new-password-section"
          >

            <div class="verified-message">
              Current password verified.
            </div>


            <!-- NEW PASSWORD -->
            <div class="form-group">

              <label for="newPassword">
                New password
              </label>

              <input
                id="newPassword"
                v-model="newPassword"
                type="password"
                autocomplete="new-password"
                placeholder="Enter your new password"
              />

            </div>


            <!-- CONFIRM PASSWORD -->
            <div class="form-group">

              <label for="confirmPassword">
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                placeholder="Re-enter your new password"
              />

            </div>


            <!-- PASSWORD MATCH MESSAGE -->
            <div
              v-if="confirmPassword"
              class="password-match"
              :class="passwordsMatch ? 'match' : 'not-match'"
            >

              {{ passwordsMatch
                ? 'Passwords match.'
                : 'Passwords do not match.'
              }}

            </div>


            <!-- UPDATE PASSWORD -->
            <button
              type="submit"
              class="update-button"
              :disabled="
                saving ||
                !newPassword ||
                !confirmPassword ||
                !passwordsMatch
              "
            >

              {{ saving
                ? 'Updating...'
                : 'Update password'
              }}

            </button>

          </div>


          <!-- MESSAGE -->
          <div
            v-if="message"
            class="message"
            :class="messageType"
          >
            {{ message }}
          </div>


          <!-- BACK -->
          <button
            type="button"
            class="back-button"
            @click="goBack"
            :disabled="saving"
          >

            <span>
              ←
            </span>

            Back to profile

          </button>

        </form>

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

const fullName = ref('User')


/* =========================================================
   PASSWORD
========================================================= */

const oldPassword = ref('')

const newPassword = ref('')

const confirmPassword = ref('')


/* =========================================================
   STATE
========================================================= */

const checkingPassword = ref(false)

const passwordVerified = ref(false)

const saving = ref(false)


/* =========================================================
   MESSAGE
========================================================= */

const message = ref('')

const messageType = ref('success')


/* =========================================================
   PASSWORD MATCH
========================================================= */

const passwordsMatch = computed(() => {

  return (
    newPassword.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    newPassword.value ===
      confirmPassword.value
  )

})


/* =========================================================
   AUTH HEADERS
========================================================= */

const authHeaders = () => {

  const token =
    localStorage.getItem('token')

  return {

    'Content-Type': 'application/json',

    'Authorization':
      `Bearer ${token}`

  }

}


/* =========================================================
   VERIFY OLD PASSWORD
========================================================= */

const verifyOldPassword = async () => {

  if (!oldPassword.value) {

    showMessage(
      'Please enter your current password.',
      'error'
    )

    return

  }


  checkingPassword.value = true

  message.value = ''


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/user/verify-password`,
        {
          method: 'POST',

          headers:
            authHeaders(),

          body:
            JSON.stringify({
              password:
                oldPassword.value
            })
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
        'Current password is incorrect.'
      )

    }


    passwordVerified.value = true


    showMessage(
      'Current password verified.',
      'success'
    )


  } catch (error) {

    console.error(
      'Password verification error:',
      error
    )


    passwordVerified.value = false


    showMessage(
      error.message ||
      'Could not verify password.',
      'error'
    )

  } finally {

    checkingPassword.value = false

  }

}


/* =========================================================
   CHANGE PASSWORD
========================================================= */

const handleSubmit = async () => {

  if (!passwordVerified.value) {

    return

  }


  if (!newPassword.value) {

    showMessage(
      'Please enter a new password.',
      'error'
    )

    return

  }


  if (
    newPassword.value !==
    confirmPassword.value
  ) {

    showMessage(
      'Passwords do not match.',
      'error'
    )

    return

  }


  saving.value = true

  message.value = ''


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/user/change-password`,
        {
          method: 'PUT',

          headers:
            authHeaders(),

          body:
            JSON.stringify({

              old_password:
                oldPassword.value,

              new_password:
                newPassword.value

            })
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
        'Failed to change password.'
      )

    }


    showMessage(
      data.message ||
      'Password changed successfully.',
      'success'
    )


    oldPassword.value = ''

    newPassword.value = ''

    confirmPassword.value = ''

    passwordVerified.value = false


  } catch (error) {

    console.error(
      'Change password error:',
      error
    )


    showMessage(
      error.message ||
      'Could not change password.',
      'error'
    )

  } finally {

    saving.value = false

  }

}


/* =========================================================
   LOAD USER NAME
========================================================= */

const loadUserName = () => {

  const storedName =
    localStorage.getItem('user_name')


  if (storedName) {

    fullName.value =
      storedName

  }

}


/* =========================================================
   NAVIGATION
========================================================= */

const goHome = () => {

  router.push('/home')

}


const goBack = () => {

  router.push('/profile')

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

  const token =
    localStorage.getItem('token')


  if (!token) {

    router.push('/signin')

    return

  }


  loadUserName()

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
      700px,
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
   CARD
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

  width: 82px;

  height: 82px;

  flex-shrink: 0;

  border-radius: 50%;

  display: grid;

  place-items: center;

  background:
    #20df4f;

}


.large-avatar svg {

  width: 43px;

  height: 43px;

  fill: none;

  stroke: #111;

  stroke-width: 1.7;

  stroke-linecap: round;

  stroke-linejoin: round;

}


.profile-heading h2 {

  margin: 0;

  font-size: 23px;

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
   FORM
========================================================= */

.password-form {

  padding-top: 28px;

}


.form-group {

  margin-bottom: 17px;

}


.form-group label {

  display: block;

  margin-bottom: 7px;

  color: #666;

  font-size: 11px;

  font-weight: 700;

}


.form-group input {

  width: 100%;

  height: 48px;

  padding:
    0 14px;

  border:
    1px solid #e1e5e1;

  border-radius: 10px;

  outline: none;

  background: #fff;

  color: #111;

  font-size: 13px;

  transition:
    border-color .2s,
    box-shadow .2s;

}


.form-group input:focus {

  border-color:
    #20df4f;

  box-shadow:
    0 0 0 3px
    rgba(32,223,79,.10);

}


.form-group input:disabled {

  background: #f5f6f5;

  color: #888;

}


/* =========================================================
   VERIFY BUTTON
========================================================= */

.verify-button {

  width: 100%;

  height: 48px;

  margin-bottom: 20px;

  border: 0;

  border-radius: 11px;

  background:
    #20df4f;

  color: #111;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

}


.verify-button:hover:not(:disabled) {

  background:
    #19c943;

}


.verify-button:disabled {

  opacity: .55;

  cursor: not-allowed;

}


/* =========================================================
   NEW PASSWORD
========================================================= */

.new-password-section {

  padding-top: 3px;

}


.verified-message {

  margin-bottom: 20px;

  padding: 11px;

  border-radius: 9px;

  background:
    #edfaef;

  color:
    #159b36;

  font-size: 11px;

  font-weight: 650;

}


/* =========================================================
   PASSWORD MATCH
========================================================= */

.password-match {

  margin-top: -5px;

  margin-bottom: 15px;

  font-size: 11px;

  font-weight: 600;

}


.password-match.match {

  color:
    #159b36;

}


.password-match.not-match {

  color:
    #c33;

}


/* =========================================================
   UPDATE BUTTON
========================================================= */

.update-button {

  width: 100%;

  height: 48px;

  border: 0;

  border-radius: 11px;

  background:
    #20df4f;

  color: #111;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

}


.update-button:hover:not(:disabled) {

  background:
    #19c943;

}


.update-button:disabled {

  opacity: .55;

  cursor: not-allowed;

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


.back-button:hover:not(:disabled) {

  border-color:
    #20df4f;

  color:
    #159b36;

  background:
    #f7fff8;

}


.back-button:disabled {

  opacity: .55;

  cursor: not-allowed;

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


  .large-avatar {

    width: 72px;

    height: 72px;

  }


  .profile-heading h2 {

    font-size: 20px;

  }

}

</style>
```
