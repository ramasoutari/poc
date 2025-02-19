import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import MultiCreatableField from "../multi-creatable-field/multi-creatable-field";

// ----------------------------------------------------------------------

export default function RHFMultiCreatableField({
  name,
  label,
  placeholder,
  helperText,
  ...other
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <MultiCreatableField
            onChange={(newValue) => field.onChange(newValue)}
            value={field.value || []}
          />
        </>
      )}
    />
  );
}

RHFMultiCreatableField.propTypes = {
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};
