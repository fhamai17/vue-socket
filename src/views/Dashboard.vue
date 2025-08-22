<template>
  <div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <Navbar @logout="handleLogout" @show-noti="handleShowNoti" />

    <main class="flex-grow p-6">
      <h1 class="text-3xl font-bold mb-6">Welcome to Dashboard</h1>
      <p class="text-gray-300">This is your dashboard content.</p>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'

function handleLogout() {
  localStorage.removeItem('token');
  alert('Logout clicked')
  window.location.reload();
}

function handleShowNoti() {
  alert('Show notifications clicked')
  // เพิ่ม logic แสดงแจ้งเตือน
}

function showNotificationToast(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>
