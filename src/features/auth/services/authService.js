import api from '../../../services/api'

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: Object}>} Authentication response with token and user
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

/**
 * Register new user
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Registration response
 */
export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password })
  return response.data
}
