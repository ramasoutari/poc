import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import RepeaterField from "../repeater-field";
// @mui
// components

// ----------------------------------------------------------------------

export default function RHFRepeaterField({
  name,
  helperText,
  type,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <RepeaterField
            {...other}
            value={field.value}
            onChange={field.onChange}
            error={Boolean(error)}
            helperText={error ? error.message : helperText}
            label={other?.label}
            fields={other?.fields}
          />
        </>
      )}
    />
  );
}

RHFRepeaterField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};
