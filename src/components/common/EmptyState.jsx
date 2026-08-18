import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * EmptyState - Reusable empty list placeholder component
 * Displays icon, title, and description when no data is available
 */
function EmptyState({ title, description, icon }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        py: 4,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ fontSize: 64, mb: 2, opacity: 0.5 }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node,
}

EmptyState.defaultProps = {
  icon: null,
}

export default EmptyState
