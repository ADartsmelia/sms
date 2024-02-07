import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export default function RHFTextFieldCustom({ helperText, type, value, setter, error }) {
  return (
    <TextField
      fullWidth
      type={type}
      value={value}
      onChange={(event) => {
        if (type === 'number') {
          setter(Number(event.target.value));
        } else {
          setter(event.target.value);
        }
      }}
      error={!!error}
      helperText={error ? error?.message : helperText}
    />
  );
}

RHFTextFieldCustom.propTypes = {
  helperText: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  setter: PropTypes.func,
};
