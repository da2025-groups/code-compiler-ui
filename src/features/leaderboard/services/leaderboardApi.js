import api from '../../../services/api'

/**
 * Fetch global leaderboard rankings
 * Public API endpoint but page requires authentication
 * @returns {Promise<Array>} Array of ranking objects: [{ rank, user_id, name, solved_count, total_score }]
 */
export const getRankings = async () => {
  const response = await api.get('/rankings')
  return response.data
}
