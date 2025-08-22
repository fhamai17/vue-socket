import axios from 'axios'

const api = axios.create({
  baseURL: 'https://disaster-backend.gentechsoft.tech',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true
})

// Automatically include token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
