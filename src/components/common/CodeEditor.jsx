import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * CodeEditor - Wrapper for Monaco Editor
 * Provides syntax highlighting and code editing functionality
 */
function CodeEditor({ language, value, onChange, height }) {
  const handleEditorChange = (newValue) => {
    onChange(newValue || '')
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: 'on',
          readOnly: false,
        }}
      />
    </Box>
  )
}

CodeEditor.propTypes = {
  language: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  height: PropTypes.string,
}

CodeEditor.defaultProps = {
  height: '500px',
}

export default CodeEditor
