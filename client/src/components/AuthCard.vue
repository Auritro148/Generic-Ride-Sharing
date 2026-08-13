<template>
  <main class="card-container" id="auth-card">

    <!-- Logo -->
    <div class="logo-container" id="logo-wrapper">
      <span class="logo-text" id="logo">{{ logoText }}</span>
    </div>

    <!-- Account Prompt -->
    <!-- <p class="account-prompt">
      Have an account?
      <a
        href="#"
        id="link-sign-in"
        @click.prevent="handleSignIn"
      >
        Sign in
      </a>
    </p> -->

    <!-- Sign In -->
    <button
      type="button"
      class="btn btn-outline"
      id="btn-sign-in"
      @click="handleSignIn"
    >
      Sign in
    </button>

    <!-- Sign Up -->
    <button
      type="button"
      class="btn btn-primary"
      id="btn-sign-up"
      @click="handleSignUp"
    >
      Sign up
    </button>

  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const logoText = ref('logo')

const handleSignIn = () => {
  router.push('/signin')
}

const handleSignUp = () => {
  router.push('/signup')
}
</script>

<style scoped>
.card-container {
  background-color: #ffffff;
  border: 2px solid #b2ebf2;
  border-radius: 16px;
  padding: 45px 35px;
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  box-shadow: 0 10px 25px rgba(0, 150, 136, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  margin: 0 auto;
}

.logo-container {
  width: 100%;
  height: 100px;

  border: 2px solid #80deea;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #f4fbfd;
  margin-bottom: 5px;
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  color: #00838f;
  letter-spacing: 1px;
}

.account-prompt {
  font-size: 0.95rem;
  color: #006064;
  text-align: center;
}

.account-prompt a {
  color: #00838f;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;
}

.account-prompt a:hover {
  color: #004d40;
}

.btn {
  width: 100%;
  padding: 12px 20px;

  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.25s ease;
  text-align: center;
}

.btn-outline {
  background-color: #ffffff;
  border: 2px solid #00acc1;
  color: #00838f;
}

.btn-outline:hover {
  background-color: #e0f7fa;
  border-color: #00838f;
}

.btn-primary {
  background-color: #00acc1;
  border: 2px solid #00acc1;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #00838f;
  border-color: #00838f;
}
</style>