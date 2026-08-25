<template>
  <div class="signin-page">

    <!-- Background overlay -->
    <div class="page-overlay"></div>

    <!-- ================= NAVBAR ================= -->
    <nav class="navbar">

      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="logo-text">Rooda</span>
      </div>

      <!-- Back to Home -->
      <button
        type="button"
        class="home-btn"
        @click="goHome"
      >
        Home
      </button>

    </nav>


    <!-- ================= SIGN IN CARD ================= -->
    <main class="signin-wrapper">

      <div class="signin-card">

        <!-- Header -->
        <div class="signin-header">

          <h1>Welcome back</h1>

          <p>
            Sign in to continue your journey with Rooda.
          </p>

        </div>


        <!-- Form -->
        <form @submit.prevent="handleLogin">

          <!-- Email -->
          <div class="input-group">

            <label for="email">
              Email
            </label>

            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              required
            />

          </div>


          <!-- Password -->
          <div class="input-group">

            <div class="password-label">

              <label for="password">
                Password
              </label>

              <a href="#" @click.prevent="handleForgotPassword">
                Forgot password?
              </a>

            </div>

            <div class="password-wrapper">

              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="show-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>

            </div>

          </div>


          <!-- Error message -->
          <p
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </p>


          <!-- Sign In -->
          <button
            type="submit"
            class="signin-btn"
          >
            <span>Sign In</span>

            <span class="arrow-circle">
              →
            </span>
          </button>

        </form>


        <!-- Sign Up -->
        <div class="signup-prompt">

          <span>Don't have an account?</span>

          <button
            type="button"
            @click="goToSignUp"
          >
            Sign Up
          </button>

        </div>

      </div>

    </main>

  </div>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signIn } from '../controllers/authController'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    console.log('Form being sent:', form)

    const response = await signIn(form)

    console.log('Backend response:', response)

    successMessage.value = 'Sign in successful!'

    router.push('/home')

  } catch (error) {
    console.error('Sign in error:', error)

    errorMessage.value =
      error.message || 'Something went wrong.'

  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

const goToSignUp = () => {
  router.push('/signup')
}

const handleForgotPassword = () => {
  console.log('Forgot password clicked')
}
</script>


<style scoped>

/* =========================================
   RESET
========================================= */

:global(*) {
  box-sizing: border-box;
}

:global(html),
:global(body),
:global(#app) {
  margin: 0;
  padding: 0;

  width: 100%;
  min-height: 100%;

  overflow-x: hidden;
}


/* =========================================
   PAGE
========================================= */

.signin-page {
  position: relative;

  width: 100vw;
  height: 100vh;

  min-height: 650px;

  overflow: hidden;

  background-image: url('/images/hero.jpg');

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;
}


/* =========================================
   OVERLAY
========================================= */

.page-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78),
      rgba(0, 0, 0, 0.60)
    );

  z-index: 1;
}


/* =========================================
   NAVBAR
========================================= */

.navbar {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 90px;

  padding: 0 5.5%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  z-index: 5;
}


/* =========================================
   LOGO
========================================= */

.logo {
  display: flex;

  align-items: center;

  gap: 10px;

  color: white;
}

.logo-text {
  font-size: 34px;

  font-weight: 700;

  letter-spacing: -1.5px;
}


/* Green logo */

.logo-icon {
  width: 34px;
  height: 34px;

  display: grid;

  grid-template-columns: 15px 15px;

  grid-template-rows: 15px 15px;

  gap: 4px;
}

.logo-icon span {
  width: 15px;
  height: 15px;

  background: #20df4f;

  border-radius: 50%;
}

.logo-icon span:nth-child(2) {
  border-radius: 50% 50% 50% 0;
}

.logo-icon span:nth-child(3) {
  border-radius: 50% 0 50% 50%;
}

.logo-icon span:nth-child(4) {
  border-radius: 0 50% 50% 50%;
}


/* =========================================
   HOME BUTTON
========================================= */

.home-btn {
  padding: 11px 21px;

  border: 1px solid rgba(255, 255, 255, 0.7);

  border-radius: 25px;

  background: transparent;

  color: white;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s ease;
}

.home-btn:hover {
  background: white;

  color: #111;
}


/* =========================================
   SIGN IN WRAPPER
========================================= */

.signin-wrapper {
  position: relative;

  z-index: 3;

  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 100px 20px 30px;
}


/* =========================================
   SIGN IN CARD
========================================= */

.signin-card {
  width: 100%;

  max-width: 470px;

  padding: 42px;

  border-radius: 24px;

  background: rgba(18, 18, 18, 0.82);

  border: 1px solid rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(18px);

  -webkit-backdrop-filter: blur(18px);

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.45);
}


/* =========================================
   HEADER
========================================= */

.signin-header {
  margin-bottom: 32px;
}

.signin-header h1 {
  margin: 0 0 10px;

  color: white;

  font-size: 38px;

  font-weight: 600;

  letter-spacing: -1.5px;
}

.signin-header p {
  margin: 0;

  color: rgba(255, 255, 255, 0.62);

  font-size: 15px;

  line-height: 1.5;
}


/* =========================================
   INPUT GROUP
========================================= */

.input-group {
  margin-bottom: 23px;
}

.input-group label {
  display: block;

  margin-bottom: 9px;

  color: rgba(255, 255, 255, 0.9);

  font-size: 14px;

  font-weight: 500;
}


/* =========================================
   PASSWORD LABEL
========================================= */

.password-label {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.password-label a {
  color: #20df4f;

  font-size: 13px;

  text-decoration: none;
}

.password-label a:hover {
  text-decoration: underline;
}


/* =========================================
   INPUT
========================================= */

.input-group input {
  width: 100%;

  height: 53px;

  padding: 0 16px;

  border: 1px solid rgba(255, 255, 255, 0.16);

  border-radius: 12px;

  outline: none;

  background: rgba(255, 255, 255, 0.07);

  color: white;

  font-size: 15px;

  transition: 0.25s ease;
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.input-group input:focus {
  border-color: #20df4f;

  background: rgba(255, 255, 255, 0.09);

  box-shadow:
    0 0 0 3px rgba(32, 223, 79, 0.08);
}


/* =========================================
   PASSWORD
========================================= */

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 70px;
}

.show-password {
  position: absolute;

  right: 14px;

  top: 50%;

  transform: translateY(-50%);

  border: none;

  background: transparent;

  color: #20df4f;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;
}


/* =========================================
   ERROR
========================================= */

.error-message {
  margin: -5px 0 18px;

  color: #ff6b6b;

  font-size: 13px;
}


/* =========================================
   SIGN IN BUTTON
========================================= */

.signin-btn {
  width: 100%;

  height: 62px;

  border: none;

  border-radius: 35px;

  background: #20df4f;

  color: #111;

  padding: 7px 8px 7px 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  font-size: 17px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.3s ease;
}

.signin-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 10px 30px rgba(32, 223, 79, 0.25);
}


/* Arrow */

.arrow-circle {
  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: #111;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  transition: 0.3s ease;
}

.signin-btn:hover .arrow-circle {
  transform: translateX(3px);
}


/* =========================================
   SIGN UP PROMPT
========================================= */

.signup-prompt {
  margin-top: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  color: rgba(255, 255, 255, 0.55);

  font-size: 14px;
}

.signup-prompt button {
  border: none;

  background: transparent;

  color: #20df4f;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;
}

.signup-prompt button:hover {
  text-decoration: underline;
}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 600px) {

  .navbar {
    height: 75px;

    padding: 0 25px;
  }

  .logo-text {
    font-size: 27px;
  }

  .home-btn {
    padding: 9px 15px;

    font-size: 13px;
  }

  .signin-wrapper {
    padding: 90px 18px 20px;
  }

  .signin-card {
    padding: 30px 24px;

    border-radius: 20px;
  }

  .signin-header h1 {
    font-size: 32px;
  }

}

</style>