import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import ObjectEditorField from "../object-editor-field";
// @mui
// components

// ----------------------------------------------------------------------

export default function RHFObjectEditorField({
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
          <ObjectEditorField
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

RHFObjectEditorField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};
