import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import router from './router' // 👈 import router
import store from './stores/store'

const app = createApp(App)

app.use(router) // 👈 ต้องใช้ก่อน mount
app.use(store) 
app.mount('#app')