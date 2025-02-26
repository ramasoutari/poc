import PropTypes from "prop-types";
import { useFormContext, Controller, useController } from "react-hook-form";
// @mui
import {
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  FormHelperText,
  Box,
} from "@mui/material";
// hooks
// components
import { Fragment } from "react";
import { useBoolean } from "../../hooks/use-boolean";
import Iconify from "../iconify";

// ----------------------------------------------------------------------

export default function RHFTextField({
  name,
  helperText,
  type,
  inputSteps,
  inputType,
  multiline,
  rows,
  allowZero,
  disableAutoComplete,
  ...other
}) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  const isSecure = useBoolean(inputType === "password");
  const isSteppedInput = Number(inputSteps) > 0;

  return (
    <>
      {!isSteppedInput && (
        <TextField
          // sx={{ filter: 'blur(5px)' }}
          {...field}
          {...other}
          fullWidth
          // eslint-disable-next-line no-nested-ternary
          type={isSecure.value ? (!isSecure.value ? "text" : "password") : type}
          value={
            type === "number" && field.value === 0 && !allowZero
              ? ""
              : field.value
          }
          onWheel={(e) => e.target.blur()}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              if (event.target.value === " ") return;

              if (inputType === "numeric-text" || inputType === "number") {
                if (
                  !isNaN(event.target.value) &&
                  !event.target.value.includes(" ") &&
                  !event.target.value.includes(".")
                ) {
                  field.onChange(event.target.value);
                }
                return;
              }
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          // helperText={error ? error?.message : helperText}
          multiline={multiline}
          rows={rows}
          minRows={rows}
          InputProps={{
            multiline,
            rows,
            minRows: rows,
            endAdornment: inputType === "password" && (
              <InputAdornment position="end">
                <IconButton onClick={isSecure.onToggle}>
                  <Iconify
                    icon={
                      isSecure.value ? "eva:eye-off-outline" : "eva:eye-outline"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
            autoComplete: disableAutoComplete ? "new-password" : "on",
          }}
        />
      )}
      {isSteppedInput && (
        <>
          <Stack direction="row" alignItems="center" gap={1}>
            {Array.from({ length: Number(inputSteps) }).map((_, index) => (
              <Fragment key={index}>
                <TextField
                  {...field}
                  {...other}
                  placeholder={
                    // letter for each index Alphabet
                    String.fromCharCode(65 + index)
                  }
                  fullWidth
                  type={type}
                  error={!!error}
                  inputProps={{ maxLength: 3 }}
                  // 3 digits per input for value and onChange
                  value={field.value?.slice(index * 3, index * 3 + 3)}
                  onChange={(event) => {
                    const value = event.target.value;
                    // 3 digits per input for value and onChange
                    const newValue = field.value
                      ?.slice(0, index * 3)
                      .concat(value)
                      .concat(field.value?.slice(index * 3 + 3));
                    field.onChange(newValue);

                    // focus next input
                    if (value.length === 3 && index < Number(inputSteps) - 1) {
                      const nextInput =
                        event.target.parentNode.parentNode.nextSibling
                          ?.nextSibling;
                      nextInput?.querySelector("input").focus();
                    }
                  }}
                />
                {index < Number(inputSteps) - 1 && (
                  <Typography variant="h5" fontWeight="fontWeightLight">
                    {" "}
                    /{" "}
                  </Typography>
                )}
              </Fragment>
            ))}
          </Stack>
        </>
      )}
      <Box
        sx={{
          height: 12,
        }}
      >
        {" "}
        {((error && error.message) || helperText) && (
          <FormHelperText error={!!error} sx={{textAlign: 'right'}}>
            {error.message || helperText}
          </FormHelperText>
        )}
      </Box>
    </>
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  blurred: PropTypes.bool,
};
