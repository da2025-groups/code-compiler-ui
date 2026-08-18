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

/**
 * Fetch single question by ID
 * Returns question details including sample input/output
 * Note: test_cases field is NEVER returned (backend security)
 * @param {string|number} questionId - Question ID
 * @returns {Promise<Object>} Question object: { id, title, description, difficulty, constraints, sample_input, sample_output, created_at }
 */
export const getQuestion = async (questionId) => {
  const response = await api.get(`/questions/${questionId}`)
  return response.data
}
