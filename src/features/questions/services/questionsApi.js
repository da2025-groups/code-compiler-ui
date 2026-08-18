import api from '../../../services/api'

/**
 * Fetch all published questions with is_solved flag
 * Requires authentication (JWT token auto-injected by api.js interceptor)
 * @returns {Promise<Array>} Array of question objects: [{ id, title, difficulty, is_solved, created_at }]
 */
export const getQuestions = async () => {
  const response = await api.get('/questions')
  return response.data
}
