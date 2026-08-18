import { AppBar, Toolbar, Typography, Button } from '@mui/material'

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Code Compiler Platform
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
