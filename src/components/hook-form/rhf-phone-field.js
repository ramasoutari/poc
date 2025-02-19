import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import PhoneField from '../phone-field';
// @mui
// components

// ----------------------------------------------------------------------

export default function RHFPhoneField({ name, helperText, type, defaultCountry, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <PhoneField
            defaultCountry="jo"
            value={field?.value || ''}
            onChange={(phone) => field.onChange(phone)}
            helperText={error ? error?.message : helperText}
            error={!!error}
            {...other}
          />
        </>
      )}
    />
  );
}

RHFPhoneField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};
