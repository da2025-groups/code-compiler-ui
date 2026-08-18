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
import useAuthStore from '../store/authStore'
import { login as loginService } from '../features/auth/services/authService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const authLogin = useAuthStore((state) => state.login)

  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required'
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Invalid email format'
    }
    return ''
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    // Validate email before submission
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }

    // Check password is not empty
    if (!password) {
      return
    }

    setLoading(true)

    try {
      const { token, user } = await loginService(email, password)
      authLogin(token, user)
      navigate('/')
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
            Login
          </Typography>

          {apiError && (
            <Alert severity="error" onClose={() => setApiError('')} sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              autoComplete="current-password"
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Typography variant="body2" align="center">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover">
                Register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage
