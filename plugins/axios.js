import axios from 'axios'

axios.interceptors.response.use((response) => {
  if (response.status === 401) {
    window.location = '/keepLoggedIn'
  }
  return response
}, (error) => {
  if (error.response.status === 401) {
    window.location = '/keepLoggedIn'
  }
  return Promise.reject(error)
})
