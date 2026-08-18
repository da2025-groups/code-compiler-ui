import api from '../../../../services/api'

/**
 * Fetch all questions (including unpublished) for admin
 * Requires admin authentication (JWT token auto-injected by api.js interceptor)
 * @returns {Promise<Array>} Array of question objects: [{ id, title, difficulty, is_published, created_at, updated_at }]
 */
export const getAdminQuestions = async () => {
  const response = await api.get('/admin/questions')
  return response.data
}

/**
 * Fetch single question by ID for editing
 * Returns full question details including test_cases (admin-only field)
 * @param {string|number} questionId - Question ID
 * @returns {Promise<Object>} Question object: { id, title, description, difficulty, constraints, sample_input, sample_output, test_cases, created_at }
 */
export const getQuestionForEdit = async (questionId) => {
  const response = await api.get(`/questions/${questionId}`)
  return response.data
}

/**
 * Create new question with test cases
 * Requires admin authentication
 * @param {Object} data - Question data: { title, description, difficulty, constraints, sample_input, sample_output, test_cases, is_published }
 * @returns {Promise<Object>} Created question object with id
 */
export const createQuestion = async (data) => {
  const response = await api.post('/questions', data)
  return response.data
}

/**
 * Update existing question
 * Requires admin authentication
 * @param {string|number} questionId - Question ID
 * @param {Object} data - Question data: { title, description, difficulty, constraints, sample_input, sample_output, test_cases, is_published }
 * @returns {Promise<Object>} Updated question object
 */
export const updateQuestion = async (questionId, data) => {
  const response = await api.put(`/questions/${questionId}`, data)
  return response.data
}
