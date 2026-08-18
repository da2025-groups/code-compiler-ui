import { TableRow, TableCell, Chip } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * TestCaseRow - Display individual test case result
 * Shows input, expected output, actual output, and verdict (pass/fail)
 */
function TestCaseRow({ testCase }) {
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-'
    const str = String(text)
    return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str
  }

  return (
    <TableRow sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
      <TableCell
        sx={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {truncateText(testCase.input)}
      </TableCell>
      <TableCell
        sx={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {truncateText(testCase.expected)}
      </TableCell>
      <TableCell
        sx={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {truncateText(testCase.actual)}
      </TableCell>
      <TableCell sx={{ textAlign: 'center' }}>
        <Chip
          label={testCase.verdict ? 'Pass' : 'Fail'}
          color={testCase.verdict ? 'success' : 'error'}
          size="small"
        />
      </TableCell>
    </TableRow>
  )
}

TestCaseRow.propTypes = {
  testCase: PropTypes.shape({
    input: PropTypes.string,
    expected: PropTypes.string,
    actual: PropTypes.string,
    verdict: PropTypes.bool.isRequired,
  }).isRequired,
}

export default TestCaseRow
