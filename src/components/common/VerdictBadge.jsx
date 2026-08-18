import { Chip } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * VerdictBadge - Status badge for code execution results
 * Displays color-coded status (success, error, timeout)
 */
function VerdictBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted':
      case 'success':
        return { label: 'Accepted', color: 'success' }
      case 'error':
      case 'runtime_error':
        return { label: 'Runtime Error', color: 'error' }
      case 'timeout':
      case 'time_limit_exceeded':
        return { label: 'Time Limit Exceeded', color: 'warning' }
      default:
        return { label: 'Unknown', color: 'default' }
    }
  }

  const config = getStatusConfig(status)

  return <Chip label={config.label} color={config.color} size="small" />
}

VerdictBadge.propTypes = {
  status: PropTypes.oneOf(['accepted', 'success', 'error', 'runtime_error', 'timeout', 'time_limit_exceeded']).isRequired,
}

export default VerdictBadge
