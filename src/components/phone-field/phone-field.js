import React, { useEffect, useRef, useState } from 'react';

// @mui
import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  FormHelperText,
  Button,
} from '@mui/material';
// components
import Label from '../label';
import { t } from 'i18next';
import { defaultCountries, parseCountry, usePhoneInput } from 'react-international-phone';
import { useLocales } from '../../locales';

export default function PhoneField({
  value,
  onChange,
  defaultCountry,
  error,
  helperText,
  verifiable,
  sx,
  hideDialCodePicker = false,
  ...restProps
}) {
  const [isVerified, setIsVerified] = useState(false);
  const didMount = useRef(false);
  const { t } = useLocales();
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: defaultCountry,
    value,
    countries: defaultCountries || [],
    forceDialCode: true,
    onChange: (data) => {
      // Dont change first time
      if (didMount.current) onChange(data?.phone || '');
    },
  });

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    }
  }, []);

  return (
    <>
      <TextField
        variant="outlined"
        color="primary"
        placeholder="Phone number"
        value={phone}
        onChange={handlePhoneValueChange}
        type="tel"
        inputRef={inputRef}
        inputProps={{
          // maxLength: 14,
          style: {
            direction: 'ltr',
            // filter: 'blur(5px)',
          },
        }}
        InputProps={{
          ...(!hideDialCodePicker && {
            startAdornment: (
              <InputAdornment position="start">
                <Select
                  disabled={restProps.disabled}
                  MenuProps={{
                    style: {
                      height: '300px',
                      top: '10px',
                      left: '42px',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                    },
                  }}
                  sx={{
                    width: '45px',

                    // Remove default outline (display only on focus)
                    fieldset: {
                      display: 'none',
                    },
                    '&.Mui-focused:has(div[aria-expanded="false"])': {
                      fieldset: {
                        display: 'block',
                      },
                    },
                    // Update default spacing
                    '.MuiSelect-select': {
                      padding: '1px',
                      paddingRight: '24px !important',
                    },
                    svg: {
                      right: 0,
                    },
                  }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  renderValue={(value) => (
                    <>
                      {/* Dial code */}
                      {/* <FlagEmoji
                        iso2={value}
                        style={{ width: '3rem', height: '.7rem', display: 'flex' }}
                      /> */}

                      <Typography color="gray" variant="body2" dir="ltr" textAlign="center">
                        {defaultCountries.filter((c) => c[1] === value)?.[0]?.[1]?.toUpperCase()}
                      </Typography>
                    </>
                  )}
                >
                  {defaultCountries
                    ?.filter((c) => {
                      return c[0].toLowerCase() !== 'israel';
                    })
                    ?.map((c) => {
                      const country = parseCountry(c);
                      return (
                        <MenuItem key={country.iso2} value={country.iso2}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {/* <FlagEmoji width={'20rem'} iso2={country.iso2} /> */}
                            <Typography>{country.name}</Typography>
                            <Typography color="gray">+{country.dialCode}</Typography>
                          </Stack>
                        </MenuItem>
                      );
                    })}
                </Select>
              </InputAdornment>
            ),
          }),
          endAdornment: verifiable && (
            <InputAdornment position="end">
              {isVerified && <Label color="success">{t['verified']}</Label>}
              {!isVerified && (
                <Button variant="outlined" size="small" onClick={() => setIsVerified(true)}>
                  {t['verify']}
                </Button>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          ...sx,
          ...(error && {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => `${theme.palette.error.main} !important`,
            },
          }),
        }}
        {...restProps}
      />
      {helperText && (
        <FormHelperText error={error} sx={{ px: 2 }}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
}
