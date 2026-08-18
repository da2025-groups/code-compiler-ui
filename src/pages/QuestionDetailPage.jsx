import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import CodeEditor from '../components/common/CodeEditor'
import LanguageSelector from '../components/common/LanguageSelector'
import OutputPanel from '../components/common/OutputPanel'
import VerdictPanel from '../components/common/VerdictPanel'
import DifficultyBadge from '../components/common/DifficultyBadge'
import { getQuestion } from '../features/questions/services/questionsApi'
import { runSubmission, submitSolution } from '../features/questions/services/submissionsApi'
import useEditorStore from '../store/editorStore'
import { LANGUAGES, DEFAULT_CODE } from '../constants/languages'

function QuestionDetailPage() {
  const { id } = useParams()
  const { setEditorState, getEditorState } = useEditorStore()

  const [question, setQuestion] = useState(null)
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [runOutput, setRunOutput] = useState(null)
  const [submitVerdict, setSubmitVerdict] = useState(null)
  const [loading, setLoading] = useState(true)
  const [runLoading, setRunLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch question on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getQuestion(id)
        setQuestion(data)

        // Load editor state from store
        const stored = getEditorState(id)
        setLanguage(stored.language)
        setCode(stored.code)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to load question. Please try again.'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id, getEditorState])

  // Persist editor state on change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (id) {
        setEditorState(id, { language, code })
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [id, language, code, setEditorState])

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    // If code is empty, load default template
    if (!code.trim()) {
      setCode(DEFAULT_CODE[newLanguage] || '')
    }
  }

  const handleRun = async () => {
    setRunLoading(true)
    setError('')
    setRunOutput(null)

    try {
      const result = await runSubmission(id, language, code)
      setRunOutput(result)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to run code. Please try again.'
      setError(errorMessage)
    } finally {
      setRunLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    setError('')
    setSubmitVerdict(null)

    try {
      const result = await submitSolution(id, language, code)
      setSubmitVerdict(result)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to submit solution. Please try again.'
      setError(errorMessage)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error && !question) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!question) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Question not found</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* LEFT PANEL - Question Details */}
        <Grid item xs={12} md={6}>
          {/* Question Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {question.title}
            </Typography>
            <DifficultyBadge difficulty={question.difficulty} />
          </Box>

          {/* Description */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {question.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Constraints */}
          {question.constraints && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Constraints
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {question.constraints}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Sample Input/Output */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sample Input
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  margin: 0,
                }}
              >
                {question.sample_input}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Sample Output
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  margin: 0,
                }}
              >
                {question.sample_output}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PANEL - Editor and Results */}
        <Grid item xs={12} md={6}>
          {/* Editor Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <LanguageSelector value={language} onChange={handleLanguageChange} languages={LANGUAGES} />

              <Box sx={{ mb: 2 }}>
                <CodeEditor language={language} value={code} onChange={setCode} height="400px" />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleRun}
                  disabled={runLoading || submitLoading}
                  sx={{ py: 1.5 }}
                >
                  {runLoading ? <CircularProgress size={24} /> : 'Run Code'}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={runLoading || submitLoading}
                  sx={{ py: 1.5 }}
                >
                  {submitLoading ? <CircularProgress size={24} /> : 'Submit Solution'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Run Output Panel */}
          {runOutput && (
            <Box sx={{ mb: 3 }}>
              <OutputPanel
                stdout={runOutput.stdout}
                stderr={runOutput.stderr}
                executionTime={runOutput.execution_time_ms}
                status={runOutput.status}
              />
            </Box>
          )}

          {/* Submit Verdict Panel */}
          {submitVerdict && <VerdictPanel verdict={submitVerdict} />}
        </Grid>
      </Grid>
    </Container>
  )
}

export default QuestionDetailPage
