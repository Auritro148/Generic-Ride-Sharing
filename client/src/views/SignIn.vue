<template>
  <main class="signin-page">
    <div class="signin-card">

      <h1>Sign In</h1>
      <p class="subtitle">Sign in to your account</p>

      <form @submit.prevent="handleSubmit">

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>

          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>

          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Error -->
        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <!-- Success -->
        <p v-if="successMessage" class="success">
          {{ successMessage }}
        </p>

        <!-- Submit -->
        <button
          type="submit"
          class="btn"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

      </form>

      <p class="signup-text">
        Don't have an account?

        <RouterLink to="/signup">
          Sign up
        </RouterLink>
      </p>

    </div>
  </main>
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

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  loading.value = true

  try {
    const response = await signIn(form)

    console.log('Backend response:', response)

    // Store JWT
    localStorage.setItem('token', response.token)

    successMessage.value = 'Sign in successful!'

    // Go to home page
    router.push('/home')

  } catch (error) {
    console.error('Sign in error:', error)

    errorMessage.value =
      error.message || 'Something went wrong.'

  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signin-page {
  min-height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
}

.signin-card {
  width: 100%;
  max-width: 420px;

  background: white;

  padding: 40px;

  border: 2px solid #b2ebf2;
  border-radius: 16px;

  box-shadow: 0 10px 25px rgba(0, 150, 136, 0.1);
}

h1 {
  margin: 0;
  text-align: center;

  color: #00838f;
}

.subtitle {
  text-align: center;
  color: #006064;

  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;

  margin-bottom: 7px;

  font-weight: 600;
  color: #006064;
}

input {
  width: 100%;

  padding: 12px;

  border: 2px solid #b2ebf2;
  border-radius: 8px;

  font-size: 1rem;

  outline: none;
}

input:focus {
  border-color: #00acc1;
}

.btn {
  width: 100%;

  padding: 12px;

  border: none;
  border-radius: 8px;

  background: #00acc1;
  color: white;

  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
}

.btn:hover {
  background: #00838f;
}

.btn:disabled {
  background: #80cbc4;
  cursor: not-allowed;
}

.error {
  padding: 10px;

  background: #ffebee;
  color: #c62828;

  border-radius: 6px;

  margin-bottom: 15px;
}

.success {
  padding: 10px;

  background: #e8f5e9;
  color: #2e7d32;

  border-radius: 6px;

  margin-bottom: 15px;
}

.signup-text {
  margin-top: 25px;
  text-align: center;

  color: #006064;
}

.signup-text a {
  color: #00838f;
  font-weight: 600;
}
</style>