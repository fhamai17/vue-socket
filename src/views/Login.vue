<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950 px-6 py-12 text-white">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <div class="mx-auto h-14 w-14 flex items-center justify-center bg-amber-500 rounded-full shadow-lg">
          <span class="text-2xl font-bold">&lt;/&gt;</span>
        </div>
        <h2 class="mt-6 text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <form @submit.prevent="login" class="space-y-6 bg-gray-900 p-6 rounded-xl shadow-lg" novalidate>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="mt-2 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            autocomplete="username"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">{{ errors.username }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="mt-2 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
            autocomplete="current-password"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-amber-500 px-4 py-2 text-white font-semibold shadow hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50"
          >
            <span v-if="!loading">Sign in</span>
            <span v-else>Signing in...</span>
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-400">
        Not a member?
        <a href="#" class="font-medium text-amber-400 hover:text-amber-300">Create an account</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../stores/api'  // ตรวจสอบว่า path ถูกต้อง

const username = ref('')
const password = ref('')
const errors = ref({
  username: '',
  password: '',
})
const loading = ref(false)
const router = useRouter()

function validate() {
  let valid = true
  errors.value.username = ''
  errors.value.password = ''

  if (!username.value.trim()) {
    errors.value.username = 'Username is required'
    valid = false
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    valid = false
  }

  return valid
}

async function login() {
  if (!validate()) return

  loading.value = true
  try {
    const response = await api.post('/api/login', {
      username: username.value,
      password: password.value
    })

    const token = response.data.access_token
    localStorage.setItem('token', token)
    router.push('/dashboard')
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>
