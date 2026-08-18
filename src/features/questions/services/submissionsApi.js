import api from '../../../services/api'

/**
 * Run code against question's sample input (no score saved)
 * @param {string|number} questionId - Question ID
 * @param {string} language - Programming language (python, cpp, java, javascript)
 * @param {string} code - Source code to execute
 * @returns {Promise<{stdout: string, stderr: string, execution_time_ms: number, status: string}>}
 */
export const runSubmission = async (questionId, language, code) => {
  const response = await api.post('/submissions/run', {
    question_id: questionId,
    language,
    code,
  })
  return response.data
}

/**
 * Submit code for judging against all hidden test cases (score saved)
 * @param {string|number} questionId - Question ID
 * @param {string} language - Programming language (python, cpp, java, javascript)
 * @param {string} code - Source code to execute
 * @returns {Promise<{status: string, score: number, passed_cases: number, total_cases: number, results: Array}>}
 */
export const submitSolution = async (questionId, language, code) => {
  const response = await api.post('/submissions/submit', {
    question_id: questionId,
    language,
    code,
  })
  return response.data
}
