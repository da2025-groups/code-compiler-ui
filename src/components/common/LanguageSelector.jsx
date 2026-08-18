import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'

/**
 * LanguageSelector - Language selection dropdown
 * Allows users to choose programming language for code execution
 */
function LanguageSelector({ value, onChange, languages }) {
  const handleChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="language-selector-label">Language</InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={value}
        label="Language"
        onChange={handleChange}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.id} value={lang.id}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

LanguageSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default LanguageSelector
