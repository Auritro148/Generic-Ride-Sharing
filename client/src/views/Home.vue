<template>
  <div class="home">
    <h1>Home Page</h1>

    <button @click="getProfile">
      👤 Profile
    </button>

    <div v-if="loading">
      Loading profile...
    </div>

    <div v-if="profile">
      <h2>Profile Data</h2>

      <p><strong>Name:</strong> {{ profile.name }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Age:</strong> {{ profile.age }}</p>
    </div>

    <p v-if="error" class="error">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const profile = ref(null)
const loading = ref(false)
const error = ref('')

const getProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('JWT token not found')
    }

    const response = await fetch('http://localhost:5000/core/user/profile', {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile')
    }

    profile.value = data

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  padding: 40px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>