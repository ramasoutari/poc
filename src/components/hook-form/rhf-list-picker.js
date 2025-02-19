import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import ListPicker from '../list-picker';

// ----------------------------------------------------------------------

export default function RHFListPicker({ name, helperText, items, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <ListPicker
            items={items}
            checked={field.value}
            onChange={(value) => {
              field.onChange(value);
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
        </>
      )}
    />
  );
}

RHFListPicker.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};
