import axiosClient from './axiosClient'

export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axiosClient.post('/users/register', userData)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/users/login', credentials)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  },

  // Logout user
  logout: () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }
}
