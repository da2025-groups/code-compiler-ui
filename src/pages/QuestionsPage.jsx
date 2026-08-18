import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import DifficultyBadge from '../components/common/DifficultyBadge'
import EmptyState from '../components/common/EmptyState'
import { getQuestions } from '../features/questions/services/questionsApi'

function QuestionsPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getQuestions()
        setQuestions(data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to load questions. Please try again.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleTitleClick = (questionId) => {
    navigate(`/questions/${questionId}`)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Problems
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Select a problem to solve
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

      {!loading && questions.length === 0 && (
        <EmptyState
          title="No problems available"
          description="Check back later for new coding challenges"
        />
      )}

      {!loading && questions.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
                  Solved
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow
                  key={question.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() => handleTitleClick(question.id)}
                    >
                      {question.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {question.is_solved && <CheckCircle color="success" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  )
}

export default QuestionsPage
