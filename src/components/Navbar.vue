<script setup>
import { ref, onMounted } from 'vue'
import '../stores/echo.js'
import api from '../stores/api.js'
import { useStore } from 'vuex'
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';
const notificationCount = ref(0)
const emit = defineEmits(['show-noti'])
const store = useStore()

async function getProfile() {
  try {
    const res = await api.get('/api/profile')
    const userId = res.data.data.id
    store.commit('setUserId', userId)
    console.log('UserId stored:', userId)
    return userId
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

async function listenReverb() {
  console.log('listenReverb')
  const userId = store.getters.getUserId
  if (!userId) {
    console.warn('User ID not found in store')
    return
  }
  Echo.private(`App.Models.User.${userId}`)
    .listen('.user.notification', (e) => {
      console.log('Notification event:', e)
      notificationCount.value = e.count
      const toastMessage = `${e.title}\n${e.description}`
      toast(toastMessage, {
        "theme": "dark",
        "type": "default",
        "position": "bottom-right"
      })
    })

  // รับ event เพื่อ refresh หน้า
  Echo.channel('Product')
    .listen('.page.refresh', (e) => {
      console.log('Refresh event:', e)
      // action refresh หน้า
    })
}

onMounted(async () => {
  console.log('onMounted')
  const userId = await getProfile()
  if (userId) {
    listenReverb()
  }
})

function handleNotificationClick() {
  notificationCount.value = 0
  // ส่ง event ไปให้ component แม่ ถ้ายังใช้การเปิด popup
  emit('show-noti')
}

</script>

<template>
  <nav class="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
    <!-- Logo -->
    <div class="flex items-center space-x-3">
      <div
        class="h-10 w-10 flex items-center justify-center bg-amber-500 rounded-full shadow-lg text-black font-bold text-lg select-none">
        &lt;/&gt;
      </div>
      <span class="text-xl font-semibold">Dashboard</span>
    </div>

    <!-- Menu Buttons -->
    <div class="flex items-center space-x-4">
      <!-- Notification -->
      <button @click="handleNotificationClick" class="relative p-2 rounded-md hover:bg-gray-800 transition"
        aria-label="Notifications">
        <svg class="w-6 h-6 text-gray-300 hover:text-amber-500 transition" fill="none" stroke="currentColor"
          stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        <span v-if="notificationCount > 0"
          class="absolute -top-1 -right-1 bg-amber-500 text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
          {{ notificationCount }}
        </span>
      </button>

      <!-- Logout -->
      <button @click="$emit('logout')"
        class="bg-amber-500 text-gray-900 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition">
        Logout
      </button>
    </div>
  </nav>
</template>
