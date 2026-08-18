import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'
import EmptyState from '../components/common/EmptyState'
import { getRankings } from '../features/leaderboard/services/leaderboardApi'
import useAuthStore from '../store/authStore'

function LeaderboardPage() {
  const user = useAuthStore((state) => state.user)
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getRankings()
        setRankings(data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to load leaderboard. Please try again.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  const getRowStyle = (rank, userId) => {
    const baseStyle = { '&:hover': { bgcolor: 'action.hover' } }

    // Top 3 get medal colors
    if (rank === 1) return { ...baseStyle, bgcolor: '#FFD700', fontWeight: 'bold' } // Gold
    if (rank === 2) return { ...baseStyle, bgcolor: '#C0C0C0', fontWeight: 'bold' } // Silver
    if (rank === 3) return { ...baseStyle, bgcolor: '#CD7F32', fontWeight: 'bold' } // Bronze

    // Current user highlight (if not in top 3)
    if (user?.user_id && userId === user.user_id) {
      return { ...baseStyle, bgcolor: 'action.selected' }
    }

    return baseStyle
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Global Leaderboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Top performers across all challenges
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && rankings.length === 0 && (
        <EmptyState
          title="No rankings yet"
          description="Be the first to solve problems and climb the leaderboard!"
        />
      )}

      {!loading && rankings.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '150px', textAlign: 'center' }}>
                  Solved
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '150px', textAlign: 'center' }}>
                  Total Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((entry) => (
                <TableRow key={entry.user_id} sx={getRowStyle(entry.rank, entry.user_id)}>
                  <TableCell>{entry.rank}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{entry.solved_count}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{entry.total_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  )
}

export default LeaderboardPage
