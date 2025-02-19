import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { MuiOtpInput } from "mui-one-time-password-input";
// @mui
import FormHelperText from "@mui/material/FormHelperText";
import { Box } from '@mui/material';
import { useResponsive } from "../../hooks/use-responsive";

// ----------------------------------------------------------------------

export default function RHFOTPField({ name, otpLength, ...other }) {
  const { control } = useFormContext();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive("up", "md")
  const lgUp = useResponsive("up", "lg")
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box dir="ltr">
          <MuiOtpInput
            justifyContent={"center"}
            {...field}
            autoFocus
            gap={0.3}
            length={otpLength || 4}
            validateChar={(val) => !isNaN(val)}

            TextFieldsProps={{
              error: !!error,
              placeholder: "-",
              style: {
                width: '5rem'
              },
            }}
            {...other}

          />

          {error && (
            <FormHelperText sx={{ px: 2 }} error>
              {error.message}
            </FormHelperText>
          )}

        </Box>
      )}
    />
  );
}

RHFOTPField.propTypes = {
  name: PropTypes.string,
};
