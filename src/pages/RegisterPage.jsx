import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'
import { register as registerService } from '../features/auth/services/authService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validateName = (value) => {
    if (!value) {
      return 'Name is required'
    }
    return ''
  }

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required'
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Invalid email format'
    }
    return ''
  }

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required'
    }
    return ''
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    setNameError(validateName(value))
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setPasswordError(validatePassword(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    // Validate all fields before submission
    const nameValidationError = validateName(name)
    const emailValidationError = validateEmail(email)
    const passwordValidationError = validatePassword(password)

    setNameError(nameValidationError)
    setEmailError(emailValidationError)
    setPasswordError(passwordValidationError)

    if (nameValidationError || emailValidationError || passwordValidationError) {
      return
    }

    setLoading(true)

    try {
      await registerService(name, email, password)
      navigate('/login')
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'An unexpected error occurred'
      setApiError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Register
          </Typography>

          {apiError && (
            <Alert severity="error" onClose={() => setApiError('')} sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={name}
              onChange={handleNameChange}
              error={Boolean(nameError)}
              helperText={nameError}
              required
              margin="normal"
              autoComplete="name"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
              required
              margin="normal"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(passwordError)}
              helperText={passwordError}
              required
              margin="normal"
              autoComplete="new-password"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterPage
