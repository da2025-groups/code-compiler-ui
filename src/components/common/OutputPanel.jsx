import { Card, CardContent, Typography, Box, Divider } from '@mui/material'
import PropTypes from 'prop-types'
import VerdictBadge from './VerdictBadge'

/**
 * OutputPanel - Displays code execution results
 * Shows stdout, stderr, execution time, and status badge
 */
function OutputPanel({ stdout, stderr, executionTime, status }) {
  const formatTime = (ms) => {
    if (ms === null || ms === undefined) return '-'
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
  }

  const hasOutput = stdout || stderr || status

  if (!hasOutput) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Output
          </Typography>
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Run your code to see the output here
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Output</Typography>
          {status && <VerdictBadge status={status} />}
        </Box>

        {executionTime !== null && executionTime !== undefined && (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Execution Time: {formatTime(executionTime)}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        {stdout && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              Standard Output:
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '300px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {stdout}
            </Box>
          </Box>
        )}

        {stderr && (
          <Box>
            <Typography variant="subtitle2" color="error.main" gutterBottom>
              Standard Error:
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: 'error.light',
                color: 'error.contrastText',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '300px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {stderr}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

OutputPanel.propTypes = {
  stdout: PropTypes.string,
  stderr: PropTypes.string,
  executionTime: PropTypes.number,
  status: PropTypes.oneOf(['success', 'error', 'timeout']),
}

OutputPanel.defaultProps = {
  stdout: '',
  stderr: '',
  executionTime: null,
  status: null,
}

export default OutputPanel
