import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material'
import { createQuestion, updateQuestion, getQuestionForEdit } from '../services/adminQuestionsApi'

function QuestionForm({ mode, questionId }) {
  const navigate = useNavigate()
  const isEditMode = mode === 'edit'

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [constraints, setConstraints] = useState('')
  const [sampleInput, setSampleInput] = useState('')
  const [sampleOutput, setSampleOutput] = useState('')
  const [testCases, setTestCases] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  // Validation errors
  const [titleError, setTitleError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [sampleInputError, setSampleInputError] = useState('')
  const [sampleOutputError, setSampleOutputError] = useState('')
  const [testCasesError, setTestCasesError] = useState('')

  // API state
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditMode)
  const [apiError, setApiError] = useState('')

  // Fetch question data for edit mode
  useEffect(() => {
    if (isEditMode && questionId) {
      const fetchQuestion = async () => {
        setFetchLoading(true)
        setApiError('')
        try {
          const data = await getQuestionForEdit(questionId)
          setTitle(data.title || '')
          setDescription(data.description || '')
          setDifficulty(data.difficulty || 'easy')
          setConstraints(data.constraints || '')
          setSampleInput(data.sample_input || '')
          setSampleOutput(data.sample_output || '')
          setTestCases(data.test_cases ? JSON.stringify(data.test_cases, null, 2) : '')
          setIsPublished(data.is_published || false)
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || err.message || 'Failed to load question. Please try again.'
          setApiError(errorMessage)
        } finally {
          setFetchLoading(false)
        }
      }

      fetchQuestion()
    }
  }, [isEditMode, questionId])

  // Validation functions
  const validateTitle = (value) => {
    if (!value.trim()) return 'Title is required'
    return ''
  }

  const validateDescription = (value) => {
    if (!value.trim()) return 'Description is required'
    return ''
  }

  const validateSampleInput = (value) => {
    if (!value.trim()) return 'Sample input is required'
    return ''
  }

  const validateSampleOutput = (value) => {
    if (!value.trim()) return 'Sample output is required'
    return ''
  }

  const validateTestCases = (value) => {
    if (!value.trim()) return 'Test cases are required'

    try {
      const parsed = JSON.parse(value)

      if (!Array.isArray(parsed)) {
        return 'Test cases must be a JSON array'
      }

      if (parsed.length === 0) {
        return 'Test cases array cannot be empty'
      }

      for (let i = 0; i < parsed.length; i++) {
        const testCase = parsed[i]
        if (typeof testCase !== 'object' || testCase === null) {
          return `Test case at index ${i} must be an object`
        }
        if (!Object.prototype.hasOwnProperty.call(testCase, 'input')) {
          return `Test case at index ${i} is missing "input" field`
        }
        if (!Object.prototype.hasOwnProperty.call(testCase, 'expected_output')) {
          return `Test case at index ${i} is missing "expected_output" field`
        }
      }

      return ''
    } catch (err) {
      return `Invalid JSON: ${err.message}`
    }
  }

  // Handle field changes with validation
  const handleTitleChange = (e) => {
    const value = e.target.value
    setTitle(value)
    setTitleError(validateTitle(value))
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value
    setDescription(value)
    setDescriptionError(validateDescription(value))
  }

  const handleSampleInputChange = (e) => {
    const value = e.target.value
    setSampleInput(value)
    setSampleInputError(validateSampleInput(value))
  }

  const handleSampleOutputChange = (e) => {
    const value = e.target.value
    setSampleOutput(value)
    setSampleOutputError(validateSampleOutput(value))
  }

  const handleTestCasesChange = (e) => {
    const value = e.target.value
    setTestCases(value)
    setTestCasesError(validateTestCases(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    // Pre-validate all required fields
    const titleErr = validateTitle(title)
    const descriptionErr = validateDescription(description)
    const sampleInputErr = validateSampleInput(sampleInput)
    const sampleOutputErr = validateSampleOutput(sampleOutput)
    const testCasesErr = validateTestCases(testCases)

    setTitleError(titleErr)
    setDescriptionError(descriptionErr)
    setSampleInputError(sampleInputErr)
    setSampleOutputError(sampleOutputErr)
    setTestCasesError(testCasesErr)

    if (titleErr || descriptionErr || sampleInputErr || sampleOutputErr || testCasesErr) {
      setApiError('Please fix validation errors before submitting')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        constraints: constraints.trim() || null,
        sample_input: sampleInput.trim(),
        sample_output: sampleOutput.trim(),
        test_cases: JSON.parse(testCases),
        is_published: isPublished,
      }

      if (isEditMode) {
        await updateQuestion(questionId, payload)
      } else {
        await createQuestion(payload)
      }

      navigate('/admin/questions')
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to save question. Please try again.'
      setApiError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/questions')
  }

  if (fetchLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Question' : 'Create New Question'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        {isEditMode ? 'Update question details and test cases' : 'Add a new coding problem'}
      </Typography>

      {apiError && (
        <Alert severity="error" onClose={() => setApiError('')} sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          error={Boolean(titleError)}
          helperText={titleError}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={handleDescriptionChange}
          error={Boolean(descriptionError)}
          helperText={descriptionError}
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="difficulty-label">Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty"
            value={difficulty}
            label="Difficulty"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Constraints"
          multiline
          rows={3}
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          margin="normal"
          placeholder="e.g., 1 <= n <= 1000"
        />

        <TextField
          fullWidth
          label="Sample Input"
          multiline
          rows={3}
          value={sampleInput}
          onChange={handleSampleInputChange}
          error={Boolean(sampleInputError)}
          helperText={sampleInputError}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Sample Output"
          multiline
          rows={3}
          value={sampleOutput}
          onChange={handleSampleOutputChange}
          error={Boolean(sampleOutputError)}
          helperText={sampleOutputError}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Test Cases (JSON)"
          multiline
          rows={6}
          value={testCases}
          onChange={handleTestCasesChange}
          error={Boolean(testCasesError)}
          helperText={testCasesError || 'Format: [{"input": "...", "expected_output": "..."}]'}
          required
          margin="normal"
          placeholder='[{"input": "5", "expected_output": "120"}]'
        />

        <FormControlLabel
          control={<Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />}
          label="Published"
          sx={{ mt: 2, mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update Question' : 'Create Question'}
          </Button>
          <Button variant="outlined" onClick={handleCancel} disabled={loading} fullWidth>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

QuestionForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  questionId: PropTypes.string,
}

export default QuestionForm
