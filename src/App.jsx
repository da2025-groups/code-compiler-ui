import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h1>Code Compiler Platform</h1>
        <p>MUI Theme Configured</p>
      </div>
    </ThemeProvider>
  )
}

export default App
