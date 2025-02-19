import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TimePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function RHFTimePicker({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={field.value === '' ? null : field.value}
          onChange={(date) => {
            field.onChange(date);
          }}
          fullWidth
          helperText={error ? error?.message : helperText}
          error={!!error}
          {...other}
        />
      )}
    />
  );
}

RHFTimePicker.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};
