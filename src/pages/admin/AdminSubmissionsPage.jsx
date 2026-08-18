import { useState, useEffect } from 'react'
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
import VerdictBadge from '../../components/common/VerdictBadge'
import EmptyState from '../../components/common/EmptyState'
import { getAdminSubmissions } from '../../features/admin/submissions/services/adminSubmissionsApi'

function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAdminSubmissions()
        setSubmissions(data)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to load submissions. Please try again.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

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
      <Typography variant="h4" gutterBottom>
        Submissions
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Monitor all user submissions across the platform
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

      {!loading && submissions.length === 0 && (
        <EmptyState
          title="No submissions yet"
          description="Submissions will appear here once users start solving problems"
        />
      )}

      {!loading && submissions.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Question Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '120px', textAlign: 'center' }}>
                  Language
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '150px', textAlign: 'center' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
                  Score
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '140px', textAlign: 'right' }}>
                  Submitted At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow
                  key={submission.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>{submission.user_name}</TableCell>
                  <TableCell>{submission.question_title}</TableCell>
                  <TableCell sx={{ textAlign: 'center', textTransform: 'uppercase' }}>
                    {submission.language}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <VerdictBadge status={submission.status} />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {submission.score !== null ? submission.score : '-'}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(submission.submitted_at)}
                    </Typography>
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

export default AdminSubmissionsPage
