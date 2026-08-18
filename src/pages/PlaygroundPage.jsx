import { useState } from 'react'
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material'
import CodeEditor from '../components/common/CodeEditor'
import LanguageSelector from '../components/common/LanguageSelector'
import OutputPanel from '../components/common/OutputPanel'
import { LANGUAGES, DEFAULT_LANGUAGE, DEFAULT_CODE } from '../constants/languages'
import { runCode } from '../features/playground/services/playgroundApi'

function PlaygroundPage() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [code, setCode] = useState(DEFAULT_CODE[DEFAULT_LANGUAGE])
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    // Load default code template for the selected language
    setCode(DEFAULT_CODE[newLanguage] || '')
  }

  const handleRun = async () => {
    setLoading(true)
    setError('')
    setOutput(null)

    try {
      const result = await runCode(language, code, stdin)
      setOutput(result)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to execute code. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Code Playground
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Write and execute code in multiple languages
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel: Editor and Controls */}
        <Grid item xs={12} md={6}>
          <LanguageSelector value={language} onChange={handleLanguageChange} languages={LANGUAGES} />

          <Box sx={{ mb: 2 }}>
            <CodeEditor
              language={language}
              value={code}
              onChange={setCode}
              height="500px"
            />
          </Box>

          <TextField
            fullWidth
            label="Standard Input (stdin)"
            multiline
            rows={3}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter input for your program (optional)"
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleRun}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Run Code'}
          </Button>
        </Grid>

        {/* Right Panel: Output */}
        <Grid item xs={12} md={6}>
          <OutputPanel
            stdout={output?.stdout}
            stderr={output?.stderr}
            executionTime={output?.execution_time_ms}
            status={output?.status}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default PlaygroundPage
