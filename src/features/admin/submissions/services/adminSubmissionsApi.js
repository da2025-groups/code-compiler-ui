import api from '../../../../services/api'

/**
 * Fetch all submissions (admin-only)
 * Requires admin authentication (JWT token auto-injected by api.js interceptor)
 * @returns {Promise<Array>} Array of submission objects: [{ id, user_name, question_title, language, status, score, submitted_at }]
 */
export const getAdminSubmissions = async () => {
  const response = await api.get('/admin/submissions')
  return response.data
}
