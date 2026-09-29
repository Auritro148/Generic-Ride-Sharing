<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue';

import {
  useRouter
} from 'vue-router';


const router = useRouter();


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';


const loading = ref(true);

const registering = ref(false);

const refreshing = ref(false);

const pageState = ref('register');

const errorMessage = ref('');

const request = ref(null);


function getToken() {
  return localStorage.getItem('token');
}


function authHeaders() {

  return {
    'Content-Type': 'application/json',
    'Authorization':
      `Bearer ${getToken()}`
  };

}


async function checkDriverStatus() {

  loading.value = true;

  errorMessage.value = '';

  const token = getToken();


  if (!token) {

    errorMessage.value =
      'Please log in to your Rooda account first.';

    pageState.value = 'error';

    loading.value = false;

    return;

  }


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/driver/signup`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            action: 'check_driver'
          })
        }
      );


    const data =
      await response.json();


    if (response.status === 401) {

      localStorage.removeItem('token');

      errorMessage.value =
        'Your session has expired. Please log in again.';

      pageState.value = 'error';

      return;

    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Unable to check driver registration.'
      );

    }


    if (
      data.driver_registered === true &&
      data.request
    ) {

      request.value =
        data.request;

      pageState.value =
        'existing';

      return;

    }


    request.value = null;

    pageState.value =
      'register';

  } catch (error) {

    console.error(
      'Driver status error:',
      error
    );

    errorMessage.value =
      error.message ||
      'Unable to connect to the server.';

    pageState.value =
      'error';

  } finally {

    loading.value = false;

  }

}


async function submitRegistration() {

  errorMessage.value = '';

  registering.value = true;


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/driver/signup`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            action: 'register'
          })
        }
      );


    const data =
      await response.json();


    if (response.status === 401) {

      localStorage.removeItem('token');

      errorMessage.value =
        'Your session has expired. Please log in again.';

      pageState.value =
        'error';

      return;

    }


    if (response.status === 409) {

      if (data.request) {

        request.value =
          data.request;

        pageState.value =
          'existing';

        return;

      }

      throw new Error(
        data.message ||
        'Driver registration request already exists.'
      );

    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Driver registration failed.'
      );

    }


    if (data.request) {

      request.value =
        data.request;

      pageState.value =
        'existing';

    }

  } catch (error) {

    console.error(
      'Driver registration error:',
      error
    );

    errorMessage.value =
      error.message ||
      'Unable to submit driver registration.';

  } finally {

    registering.value = false;

  }

}


async function refreshStatus() {

  refreshing.value = true;

  errorMessage.value = '';


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/driver/signup`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            action: 'status'
          })
        }
      );


    const data =
      await response.json();


    if (response.status === 401) {

      localStorage.removeItem('token');

      errorMessage.value =
        'Your session has expired. Please log in again.';

      pageState.value =
        'error';

      return;

    }


    if (response.status === 404) {

      request.value = null;

      pageState.value =
        'register';

      return;

    }


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Unable to check application status.'
      );

    }


    request.value = data;

    pageState.value =
      'existing';

  } catch (error) {

    console.error(
      'Driver status refresh error:',
      error
    );

    errorMessage.value =
      error.message ||
      'Unable to refresh application status.';

  } finally {

    refreshing.value = false;

  }

}


const formattedStatus =
  computed(() => {

    if (!request.value?.req_status) {

      return 'Unknown';

    }


    const status =
      request.value.req_status
        .toString()
        .toLowerCase();


    if (status === 'pending') {

      return 'Pending';

    }


    if (status === 'approved') {

      return 'Approved';

    }


    if (status === 'declined') {

      return 'Declined';

    }


    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );

  });


const statusClass =
  computed(() => {

    const status =
      request.value?.req_status
        ?.toString()
        .toLowerCase();


    if (status === 'approved') {

      return 'approved';

    }


    if (status === 'declined') {

      return 'declined';

    }


    return 'pending';

  });


const formattedDate =
  computed(() => {

    if (!request.value?.created_at) {

      return '';

    }


    return new Date(
      request.value.created_at
    ).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  });


function goHome() {

  router.push('/home');

}


onMounted(() => {

  checkDriverStatus();

});

</script>


<template>

  <div class="page">

    <div class="overlay"></div>


    <header class="top-bar">

      <div
        class="logo"
        @click="goHome"
      >

        <div class="logo-icon">

          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>

        <span class="logo-text">
          Rooda
        </span>

      </div>


      <button
        class="home-btn"
        @click="goHome"
      >
        Home
      </button>

    </header>


    <main class="content">


      <div
        v-if="loading"
        class="card loading-card"
      >

        <div class="spinner"></div>

        <p>
          Checking your driver registration...
        </p>

      </div>


      <div
        v-else-if="pageState === 'register'"
        class="card"
      >

        <div class="card-icon">

          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>


        <h1>
          Become a Rooda Driver
        </h1>


        <p class="subtitle">

          Turn your vehicle into an opportunity.
          Apply to become a Rooda driver using
          your existing account.

        </p>


        <div class="info-box">

          <h3>
            What happens next?
          </h3>

          <div class="info-item">
            <div class="number">1</div>

            <span>
              Submit your driver registration request.
            </span>
          </div>


          <div class="info-item">
            <div class="number">2</div>

            <span>
              Your request will be reviewed by Rooda.
            </span>
          </div>


          <div class="info-item">
            <div class="number">3</div>

            <span>
              Once approved, you can start driving.
            </span>
          </div>

        </div>


        <button
          class="action-btn"
          :disabled="registering"
          @click="submitRegistration"
        >

          <span>
            {{
              registering
                ? 'Submitting...'
                : 'Apply as Driver'
            }}
          </span>


          <span class="arrow">
            →
          </span>

        </button>


        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>

      </div>


      <div
        v-else-if="pageState === 'existing'"
        class="card"
      >

        <div class="card-icon status-icon">

          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>


        <h1>
          Driver Application
        </h1>


        <p class="subtitle">

          You already have a driver registration
          request with Rooda.

        </p>


        <div class="status-box">

          <div class="status-row">

            <span>
              Request No.
            </span>

            <strong>
              #{{ request?.req_no }}
            </strong>

          </div>


          <div class="status-row">

            <span>
              Submitted
            </span>

            <strong>
              {{ formattedDate }}
            </strong>

          </div>


          <div class="status-row">

            <span>
              Status
            </span>

            <strong
              :class="[
                'status',
                statusClass
              ]"
            >
              {{ formattedStatus }}
            </strong>

          </div>

        </div>


        <div
          v-if="
            request?.req_status?.toLowerCase()
            === 'pending'
          "
          class="message-box"
        >

          Your application is currently under
          review. Please wait for the approval
          process to be completed.

        </div>


        <div
          v-else-if="
            request?.req_status?.toLowerCase()
            === 'approved'
          "
          class="message-box approved-message"
        >

          Your driver application has been
          approved. You can now continue to
          the driver dashboard.

        </div>


        <div
          v-else-if="
            request?.req_status?.toLowerCase()
            === 'declined'
          "
          class="message-box declined-message"
        >

          Your driver application was declined.

        </div>


        <button
          class="action-btn"
          :disabled="refreshing"
          @click="refreshStatus"
        >

          <span>
            {{
              refreshing
                ? 'Checking...'
                : 'Check Status'
            }}
          </span>

          <span class="arrow">
            ↻
          </span>

        </button>


        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>

      </div>


      <div
        v-else
        class="card"
      >

        <h1>
          Something went wrong
        </h1>


        <p class="subtitle">
          {{ errorMessage }}
        </p>


        <button
          class="action-btn"
          @click="checkDriverStatus"
        >

          <span>
            Try Again
          </span>

          <span class="arrow">
            ↻
          </span>

        </button>

      </div>


    </main>

  </div>

</template>


<style scoped>

* {
  box-sizing: border-box;
}


.page {
  min-height: 100vh;

  background-image:
    url('/images/hero.jpg');

  background-size: cover;
  background-position: center;

  position: relative;

  color: white;

  font-family:
    Inter,
    Arial,
    sans-serif;
}


.overlay {
  position: absolute;

  inset: 0;

  background:
    rgba(0, 0, 0, 0.70);
}


.top-bar {
  position: relative;

  z-index: 2;

  height: 90px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 55px;
}


.logo {
  display: flex;

  align-items: center;

  gap: 11px;

  cursor: pointer;
}


.logo-icon {
  width: 34px;

  height: 34px;

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 4px;
}


.logo-icon span {
  background: #20df4f;

  border-radius: 50%;
}


.logo-text {
  font-size: 27px;

  font-weight: 700;

  letter-spacing: -1px;
}


.home-btn {
  border: 1px solid
    rgba(255, 255, 255, 0.25);

  background:
    rgba(255, 255, 255, 0.08);

  color: white;

  padding: 11px 22px;

  border-radius: 25px;

  font-size: 15px;

  cursor: pointer;

  transition: 0.2s;
}


.home-btn:hover {
  background:
    rgba(255, 255, 255, 0.16);
}


.content {
  position: relative;

  z-index: 1;

  min-height:
    calc(100vh - 90px);

  display: flex;

  align-items: center;

  justify-content: center;
  width: 100vw;

  padding: 40px 20px 70px;
}


.card {
  width: 100%;

  max-width: 560px;

  padding: 45px;

  border-radius: 28px;

  background:
    rgba(15, 20, 17, 0.82);

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  backdrop-filter:
    blur(18px);

  box-shadow:
    0 25px 70px
    rgba(0, 0, 0, 0.40);

  text-align: center;
}


.loading-card {
  min-height: 260px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;
}


.spinner {
  width: 38px;

  height: 38px;

  border-radius: 50%;

  border: 3px solid
    rgba(255, 255, 255, 0.18);

  border-top-color:
    #20df4f;

  animation:
    spin 0.8s linear infinite;

  margin-bottom: 18px;
}


@keyframes spin {

  to {
    transform: rotate(360deg);
  }

}


.card-icon {
  width: 52px;

  height: 52px;

  margin: 0 auto 22px;

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 5px;
}


.card-icon span {
  background: #20df4f;

  border-radius: 50%;
}


h1 {
  margin: 0;

  font-size: 34px;

  line-height: 1.15;

  letter-spacing: -1px;
}


.subtitle {
  color:
    rgba(255, 255, 255, 0.68);

  line-height: 1.6;

  font-size: 15px;

  margin:
    16px auto 28px;

  max-width: 440px;
}


.info-box,
.status-box {
  text-align: left;

  background:
    rgba(255, 255, 255, 0.055);

  border:
    1px solid
    rgba(255, 255, 255, 0.08);

  border-radius: 18px;

  padding: 21px;

  margin-bottom: 25px;
}


.info-box h3 {
  margin:
    0 0 17px;

  font-size: 16px;
}


.info-item {
  display: flex;

  align-items: center;

  gap: 13px;

  margin-top: 13px;

  color:
    rgba(255, 255, 255, 0.70);

  font-size: 14px;

  line-height: 1.4;
}


.number {
  min-width: 27px;

  height: 27px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #20df4f;

  color: #07100a;

  font-weight: 700;

  font-size: 13px;
}


.status-row {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  padding: 12px 0;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.07);

  font-size: 14px;
}


.status-row:last-child {
  border-bottom: none;

  padding-bottom: 0;
}


.status-row:first-child {
  padding-top: 0;
}


.status-row span {
  color:
    rgba(255, 255, 255, 0.55);
}


.status-row strong {
  color: white;

  text-align: right;
}


.status.pending {
  color: #f3c969;
}


.status.approved {
  color: #20df4f;
}


.status.declined {
  color: #ff7070;
}


.message-box {
  padding: 15px 17px;

  margin-bottom: 22px;

  border-radius: 14px;

  background:
    rgba(243, 201, 105, 0.08);

  border:
    1px solid
    rgba(243, 201, 105, 0.15);

  color:
    rgba(255, 255, 255, 0.72);

  font-size: 14px;

  line-height: 1.5;

  text-align: left;
}


.approved-message {
  background:
    rgba(32, 223, 79, 0.08);

  border-color:
    rgba(32, 223, 79, 0.18);
}


.declined-message {
  background:
    rgba(255, 112, 112, 0.08);

  border-color:
    rgba(255, 112, 112, 0.18);
}


.action-btn {
  width: 100%;

  border: none;

  background: #20df4f;

  color: #07100a;

  padding: 8px 8px 8px 22px;

  border-radius: 35px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.2s,
    opacity 0.2s;
}


.action-btn:hover:not(:disabled) {
  transform:
    translateY(-2px);
}


.action-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}


.arrow {
  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #07100a;

  color: #20df4f;

  font-size: 20px;
}


.error-message {
  margin-top: 17px;

  color: #ff8a8a;

  font-size: 13px;

  line-height: 1.5;
}


@media (max-width: 600px) {

  .top-bar {
    height: 75px;

    padding: 0 20px;
  }


  .logo-text {
    font-size: 24px;
  }


  .home-btn {
    padding:
      9px 17px;

    font-size: 13px;
  }


  .content {
    min-height:
      calc(100vh - 75px);

    padding:
      25px 15px 45px;
  }


  .card {
    padding: 32px 22px;

    border-radius: 23px;
  }


  h1 {
    font-size: 28px;
  }


  .subtitle {
    font-size: 14px;
  }


  .info-box,
  .status-box {
    padding: 17px;
  }

}

</style>