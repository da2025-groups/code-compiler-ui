import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import ProtectedLayout from './components/layout/ProtectedLayout'
import { Typography } from '@mui/material'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProtectedLayout>
        <Typography variant="h4" gutterBottom>
          Welcome to Code Compiler Platform
        </Typography>
        <Typography variant="body1">
          React 18 + Vite + MUI v5 + Axios + Zustand scaffold complete.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Next: Configure routing (CC-14)
        </Typography>
      </ProtectedLayout>
    </ThemeProvider>
  )
}

export default App
