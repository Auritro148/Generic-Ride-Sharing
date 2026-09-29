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
          Update Profile
        </h1>

        <p>
          Update your personal information.
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


        <!-- UPDATE FORM -->
        <form
          class="update-form"
          @submit.prevent="updateProfile"
        >

          <h3>
            Personal information
          </h3>


          <!-- FIRST NAME -->
          <div class="form-group">

            <label for="firstName">
              First name
            </label>

            <input
              id="firstName"
              v-model="form.first_name"
              type="text"
              autocomplete="given-name"
              placeholder="Enter your first name"
            />

          </div>


          <!-- LAST NAME -->
          <div class="form-group">

            <label for="lastName">
              Last name
            </label>

            <input
              id="lastName"
              v-model="form.last_name"
              type="text"
              autocomplete="family-name"
              placeholder="Enter your last name"
            />

          </div>


          <!-- PHONE -->
          <div class="form-group">

            <label for="phone">
              Phone number
            </label>

            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              placeholder="Enter your phone number"
            />

          </div>


          <!-- EMAIL -->
          <div class="form-group">

            <label for="email">
              Email
            </label>

            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="Enter your email"
            />

          </div>


          <!-- ACCOUNT TYPE -->
          <div class="form-group">

            <label>
              Account type
            </label>

            <input
              value="Passenger"
              type="text"
              disabled
            />

          </div>


          <!-- MESSAGE -->
          <div
            v-if="message"
            class="message"
            :class="messageType"
          >
            {{ message }}
          </div>


          <!-- BUTTONS -->
          <div class="button-row">

            <button
              type="button"
              class="cancel-button"
              @click="goBack"
              :disabled="saving"
            >
              Cancel
            </button>


            <button
              type="submit"
              class="update-button"
              :disabled="saving || !hasChanges"
            >

              {{ saving ? 'Updating...' : 'Update profile' }}

            </button>

          </div>

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
   FORM
========================================================= */

const form = ref({

  first_name: '',
  last_name: '',
  phone: '',
  email: ''

})


/* =========================================================
   ORIGINAL DATA
========================================================= */

const original = ref({

  first_name: '',
  last_name: '',
  phone: '',
  email: ''

})


/* =========================================================
   STATE
========================================================= */

const loading = ref(false)
const saving = ref(false)

const message = ref('')
const messageType = ref('success')


/* =========================================================
   FULL NAME
========================================================= */

const fullName = computed(() => {

  const firstName =
    form.value.first_name?.trim() || ''

  const lastName =
    form.value.last_name?.trim() || ''

  const name =
    `${firstName} ${lastName}`.trim()

  return name || 'User'

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
   CHECK CHANGES
========================================================= */

const hasChanges = computed(() => {

  return (
    form.value.first_name !==
      original.value.first_name ||

    form.value.last_name !==
      original.value.last_name ||

    form.value.phone !==
      original.value.phone ||

    form.value.email !==
      original.value.email
  )

})


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


  loading.value = true


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/user/profile`,
        {
          method: 'GET',
          headers: authHeaders()
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


    const profile = {

      first_name:
        data.first_name || '',

      last_name:
        data.last_name || '',

      phone:
        data.phone || '',

      email:
        data.email || ''

    }


    form.value = {
      ...profile
    }


    original.value = {
      ...profile
    }


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

  } finally {

    loading.value = false

  }

}


/* =========================================================
   UPDATE PROFILE
========================================================= */

const updateProfile = async () => {

  if (!hasChanges.value) {

    showMessage(
      'No changes were made.',
      'error'
    )

    return

  }


  saving.value = true


  try {

    const changedFields = {}


    if (
      form.value.first_name !==
      original.value.first_name
    ) {

      changedFields.first_name =
        form.value.first_name.trim()

    }


    if (
      form.value.last_name !==
      original.value.last_name
    ) {

      changedFields.last_name =
        form.value.last_name.trim()

    }


    if (
      form.value.phone !==
      original.value.phone
    ) {

      changedFields.phone =
        form.value.phone.trim()

    }


    if (
      form.value.email !==
      original.value.email
    ) {

      changedFields.email =
        form.value.email.trim()

    }


    const response =
      await fetch(
        `${API_BASE_URL}/core/user/profile`,
        {
          method: 'PUT',

          headers:
            authHeaders(),

          body:
            JSON.stringify(
              changedFields
            )
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
        'Failed to update profile'
      )

    }


    /*
     * Backend updated successfully.
     * Update the original values so that
     * the form is no longer considered changed.
     */

    original.value = {

      ...form.value

    }


    localStorage.setItem(
      'user_name',
      fullName.value
    )


    showMessage(
      data.message ||
      'Profile updated successfully.',
      'success'
    )


  } catch (error) {

    console.error(
      'Profile update error:',
      error
    )


    showMessage(
      error.message ||
      'Could not update profile.',
      'error'
    )

  } finally {

    saving.value = false

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
   FORM
========================================================= */

.update-form {

  padding-top: 28px;
}


.update-form h3 {

  margin:
    0 0 18px;

  font-size: 15px;
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

  cursor: not-allowed;
}


/* =========================================================
   MESSAGE
========================================================= */

.message {

  margin-top: 5px;

  margin-bottom: 18px;

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
   BUTTONS
========================================================= */

.button-row {

  display: flex;

  gap: 10px;

  margin-top: 24px;
}


.cancel-button,
.update-button {

  height: 48px;

  border-radius: 11px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;
}


.cancel-button {

  flex: 1;

  border:
    1px solid #ddd;

  background: white;

  color: #444;
}


.cancel-button:hover {

  border-color:
    #20df4f;

  color:
    #159b36;

  background:
    #f7fff8;
}


.update-button {

  flex: 2;

  border: 0;

  background:
    #20df4f;

  color: #111;
}


.update-button:hover:not(:disabled) {

  background:
    #19c943;
}


.update-button:disabled,
.cancel-button:disabled {

  opacity: .55;

  cursor: not-allowed;
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


  .button-row {

    flex-direction: column;
  }


  .cancel-button,
  .update-button {

    flex: none;

    width: 100%;
  }

}

</style>
```
