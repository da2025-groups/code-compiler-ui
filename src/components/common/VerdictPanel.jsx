import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'
import PropTypes from 'prop-types'
import VerdictBadge from './VerdictBadge'
import TestCaseRow from './TestCaseRow'

/**
 * VerdictPanel - Display submission verdict with score and test case breakdown
 * Shows overall status, score, and per-case results in a table
 */
function VerdictPanel({ verdict }) {
  if (!verdict) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Submission Result
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Submit your solution to see results
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        {/* Header with Verdict Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Submission Result</Typography>
          <VerdictBadge status={verdict.status} />
        </Box>

        {/* Score Display */}
        <Typography variant="body1" gutterBottom>
          Score: <strong>{verdict.passed_cases}/{verdict.total_cases}</strong> test cases passed
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Test Cases Table */}
        {verdict.results && verdict.results.length > 0 && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Input</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expected</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actual</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Verdict</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verdict.results.map((testCase, index) => (
                  <TestCaseRow key={index} testCase={testCase} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </CardContent>
    </Card>
  )
}

VerdictPanel.propTypes = {
  verdict: PropTypes.shape({
    status: PropTypes.string.isRequired,
    score: PropTypes.number,
    passed_cases: PropTypes.number.isRequired,
    total_cases: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        input: PropTypes.string,
        expected: PropTypes.string,
        actual: PropTypes.string,
        verdict: PropTypes.bool.isRequired,
      })
    ),
  }),
}

VerdictPanel.defaultProps = {
  verdict: null,
}

export default VerdictPanel
