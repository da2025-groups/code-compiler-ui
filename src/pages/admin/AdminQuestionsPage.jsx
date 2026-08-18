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
  Button,
  IconButton,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import DifficultyBadge from '../../components/common/DifficultyBadge'
import EmptyState from '../../components/common/EmptyState'
import { getAdminQuestions } from '../../features/admin/questions/services/adminQuestionsApi'

function AdminQuestionsPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAdminQuestions()
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

  const handleCreateNew = () => {
    navigate('/admin/questions/new')
  }

  const handleEdit = (questionId) => {
    navigate(`/admin/questions/${questionId}/edit`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Manage Questions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and edit coding problems
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={handleCreateNew}>
          Create New Question
        </Button>
      </Box>

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
          title="No questions yet"
          description="Create your first coding problem to get started"
        />
      )}

      {!loading && questions.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
                  Published
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '140px' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '140px' }}>Updated At</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow
                  key={question.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2">{question.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color={question.is_published ? 'success.main' : 'text.secondary'}>
                      {question.is_published ? 'Yes' : 'No'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(question.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(question.updated_at)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(question.id)}
                      aria-label="edit question"
                    >
                      <EditIcon />
                    </IconButton>
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

export default AdminQuestionsPage
