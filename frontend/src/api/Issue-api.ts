import axiosClient from './axiosClient'

export const issueAPI = {
  // Get all issues
  getAllIssues: async () => {
    try {
      const response = await axiosClient.get('/issues')
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch issues'
      }
    }
  },

  // Get single issue by ID
  getIssueById: async (id) => {
    try {
      const response = await axiosClient.get(`/issues/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch issue'
      }
    }
  },

  // Create new issue
  createIssue: async (issueData) => {
    try {
      const response = await axiosClient.post('/issues/create', issueData)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create issue'
      }
    }
  },

  // Update issue
  updateIssue: async (id, issueData) => {
    try {
      const response = await axiosClient.put(`/issues/update/${id}`, issueData)
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update issue'
      }
    }
  },

  // Get current user's issues
  getUserIssues: async () => {
    try {
      const response = await axiosClient.get('/issues/user/my-issues')
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user issues'
      }
    }
  },

  // Delete issue
  deleteIssue: async (id) => {
    try {
      const response = await axiosClient.delete(`/issues/delete/${id}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete issue'
      }
    }
  }
}
