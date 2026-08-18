import { Chip } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * DifficultyBadge - Color-coded difficulty badge component
 * Displays difficulty level with appropriate color (easy=green, medium=orange, hard=red)
 */
function DifficultyBadge({ difficulty }) {
  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Easy', color: 'success' }
      case 'medium':
        return { label: 'Medium', color: 'warning' }
      case 'hard':
        return { label: 'Hard', color: 'error' }
      default:
        return { label: 'Unknown', color: 'default' }
    }
  }

  const config = getDifficultyConfig(difficulty)

  return <Chip label={config.label} color={config.color} size="small" />
}

DifficultyBadge.propTypes = {
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired,
}

export default DifficultyBadge
