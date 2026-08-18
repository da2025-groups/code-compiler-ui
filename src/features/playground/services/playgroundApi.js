import api from '../../../services/api'

/**
 * Run code in the playground
 * @param {string} language - Programming language (python, cpp, java, javascript)
 * @param {string} code - Source code to execute
 * @param {string} stdin - Standard input for the program
 * @returns {Promise<{stdout: string, stderr: string, execution_time_ms: number, status: string}>}
 */
export const runCode = async (language, code, stdin = '') => {
  const response = await api.post('/playground/run', {
    language,
    code,
    stdin,
  })
  return response.data
}
