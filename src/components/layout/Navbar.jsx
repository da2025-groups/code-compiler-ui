import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import useAuthStore from '../../store/authStore'

function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleAdminMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAdminMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAdminMenuNavigate = (path) => {
    navigate(path)
    handleAdminMenuClose()
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Code Compiler Platform
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/playground')}>
              Playground
            </Button>
            <Button color="inherit" onClick={() => navigate('/questions')}>
              Problems
            </Button>
            <Button color="inherit" onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </Button>

            {user?.role === 'admin' && (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleAdminMenuOpen}
                  aria-label="admin menu"
                  aria-controls="admin-menu"
                  aria-haspopup="true"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="admin-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAdminMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleAdminMenuNavigate('/admin/questions')}>
                    Manage Questions
                  </MenuItem>
                  <MenuItem onClick={() => handleAdminMenuNavigate('/admin/users')}>
                    Manage Users
                  </MenuItem>
                </Menu>
              </>
            )}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
