import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import _ from 'lodash';
import { useRequest } from 'alova';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// locales
// api
// components
import { CircularProgress } from '@mui/material';
import { optionsFromAPISourceGetter } from '../../utils/api';
import { useLocales } from '../../locales';

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  events,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  isAffectedByOtherFields,
  affectingFields,
  multiple,
  optionsSourceType,
  optionsSourceApi,
  optionsSourceApiToken,
  optionsSourceApiValueKey,
  optionsSourceApiLabelKey,
  optionsSourceApiDataKey,
  excludedValues = [],
  options: manualOptions,
  placeholder,
  nullable,
  getOptionLabel,
  getOptionValue,
  sx,
  required,
  isInRepeater,
  includeExtraKeys,
  ...other
}) {
  const MenuContainerRef = useRef(null);
  const renderCount = useRef(0);
  const { t } = useLocales();
  const {
    loading,
    send,
    data: options,
    update,
  } = useRequest(
    (params) =>
      optionsFromAPISourceGetter(
        optionsSourceApi,
        // '',
        params,
        optionsSourceApiDataKey,
        optionsSourceApiLabelKey,
        optionsSourceApiValueKey,
        includeExtraKeys
        // 'appendUrl'
      ),
    {
      immediate: false,
      initialData: manualOptions || [],
    }
  );

  // ** RHF
  const { control, getValues, setValue } = useFormContext();

  const valuesOfAffectingFields = affectingFields?.map((field) => getValues(field.fieldName));

  // ** Functions
  const handleGetOptionLabel = (option) => {
    if (getOptionLabel) {
      return getOptionLabel(option);
    }
    return option.label;
  };

  const handleGetOptionValue = (option) => {
    if (getOptionValue) {
      return getOptionValue(option);
    }
    return option.value;
  };

  // Check Fields Events
  const checkFieldEvents = () => {
    if (events?.change) {
      const affectedFields = events?.change?.fields;

      if (affectedFields.length > 0) {
        affectedFields.map((affectedField) => {
          const { fieldVariable, action } = affectedField;

          switch (action) {
            case 'EMPTY_FIELD':
              setValue(fieldVariable, '');
            default:
              return false;
          }
        });
      }
    }
  };

  useEffect(() => {
    renderCount.current += 1;
    if (optionsSourceType === 'api') {
      const fetchOptions = async () => {
        let params = {};
        // if affectingFields is not null, then we need to get the value of the affectingFields field
        // and append it to the url
        if (affectingFields) {
          // if one of the affectingFields fields is empty, then we don't need to fetch the options
          // so we just return
          if (affectingFields.some((field) => !getValues(field.fieldName))) {
            return;
          }

          affectingFields.forEach((field) => {
            const { fieldName, urlKey } = field;
            const value = getValues(fieldName);
            if (!urlKey) {
              params[fieldName + '_id'] = value;
            } else {
              params[urlKey] = value;
            }
          });
        }

        send(params).then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setValue(`${name}_hasOptions`, true);
          } else {
            setValue(`${name}_hasOptions`, false);
          }
        });
      };

      fetchOptions();
    }

    // when the value of one affectingFields field changes, we need to reset the value of the current field
    // only after second render, because first and second render are use to setup fields
    // third render is for user interactions
    const renderCountToReset = isInRepeater ? 1 : 2;
    if (isAffectedByOtherFields && renderCount.current > renderCountToReset) {
      setValue(name, multiple ? [] : '');
      setValue(name + '_label', '');
      setValue(name + '_chosen_object', {});
      setValue(`${name}_hasOptions`, false);
      update({
        data: [],
      });
    }
  }, [
    // whenever the value of affectingFields changes, we need to fetch the options again
    // so we add affectingFields to the dependency array
    _.join(valuesOfAffectingFields, ','),
    isInRepeater,
  ]);

  useEffect(() => {
    if (getValues(name) && options.length > 0) {
      if (!multiple) {
        const selectedOption = options.find(
          (item) => handleGetOptionValue(item) === getValues(name)
        );
        setValue(`${name}_label`, handleGetOptionLabel(selectedOption));
        setValue(`${name}_chosen_object`, selectedOption);
      } else {
        setValue(`${name}_label`, t('all'));
        setValue(`${name}_chosen_object`, {});
      }
    }
  }, [getValues(name), options]);

  useEffect(() => {
    checkFieldEvents();
  }, [getValues(name), events]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            inputRef={MenuContainerRef}
            {...field}
            onChange={(e) => {
              field?.onChange(e.target.value);
            }}
            select
            fullWidth
            label={t('choose')}
            SelectProps={{
              multiple,
              native,
              renderValue: (value) => {
                if (multiple) {
                  let allValuesLabels = value.map((val) => {
                    return handleGetOptionLabel(
                      options.find((option) => handleGetOptionValue(option) === val)
                    );
                  });
                  return allValuesLabels.join(', ');
                }

                return handleGetOptionLabel(
                  options.find((option) => handleGetOptionValue(option) === value)
                );
              },
              MenuProps: {
                sx: {
                  zIndex: 9999,
                },
                MenuListProps: {
                  sx: {
                    zIndex: 9999,
                  },
                },
                PaperProps: {
                  sx: {
                    ...(!native && {
                      maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                    }),
                    ...PaperPropsSx,
                    zIndex: 9999,
                  },
                },
              },
              sx: { textTransform: 'capitalize', ...sx, zIndex: 9999 },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  zIndex: 9999,
                },
              },
              style: {
                zIndex: 9999,
              },
              sx: {
                zIndex: 9999,
              },
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            disabled={loading}
            {...other}
          >
            {placeholder && required && (
              <MenuItem disabled value="">
                <em> {placeholder} </em>
              </MenuItem>
            )}
            {!required && (
              <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                {placeholder || t('choose')}
              </MenuItem>
            )}
            {nullable && (
              <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                None
              </MenuItem>
            )}
            {loading && (
              <CircularProgress
                size={18}
                sx={{
                  mx: 1,
                }}
              />
            )}
            {!loading &&
              options
                .filter((item) => !excludedValues.includes(getOptionValue(item)))
                .map((option) => {
                  const isSelected = () => {
                    if (multiple) {
                      return field.value.includes(handleGetOptionValue(option));
                    }
                    return field.value === handleGetOptionValue(option);
                  };

                  return (
                    <MenuItem
                      key={handleGetOptionValue(option)}
                      value={handleGetOptionValue(option)}
                      selected={isSelected()}
                      sx={{
                        maxWidth: MenuContainerRef?.current
                          ? MenuContainerRef.current?.node?.clientWidth
                          : 'fit-content',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                      }}
                    >
                      {multiple && <Checkbox checked={isSelected()} />}
                      {handleGetOptionLabel(option)}
                    </MenuItem>
                  );
                })}
            {children}
          </TextField>
        </>
      )}
    />
  );
}

RHFSelect.propTypes = {
  PaperPropsSx: PropTypes.object,
  children: PropTypes.node,
  helperText: PropTypes.string,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  optionsSourceType: PropTypes.oneOf(['manual', 'api']),
  optionsSourceApi: PropTypes.string,
  optionsSourceApiToken: PropTypes.string,
  optionsSourceApiValueKey: PropTypes.string,
  optionsSourceApiLabelKey: PropTypes.string,
  excludedValues: PropTypes.array,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  nullable: PropTypes.bool,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  native: PropTypes.bool,
  sx: PropTypes.object,
};

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  sx,
  ...other
}) {
  const { control } = useFormContext();

  const renderValues = (selectedIds) => {
    const selectedItems = options.filter((item) => selectedIds.includes(item.value));

    if (!selectedItems.length && placeholder) {
      return (
        <Box component="em" sx={{ color: 'text.disabled' }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={sx}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            labelId={name}
            input={<OutlinedInput fullWidth label={label} error={!!error} />}
            renderValue={renderValues}
            MenuProps={{
              PaperProps: {
                sx: {
                  zIndex: 9999,
                },
              },
              style: {
                zIndex: 9999,
              },
              sx: {
                zIndex: 9999,
              },
            }}
            {...other}
          >
            {placeholder && (
              <MenuItem disabled value="">
                <em> {placeholder} </em>
              </MenuItem>
            )}

            {options.map((option) => {
              const selected = field.value.includes(option.value);

              return (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

RHFMultiSelect.propTypes = {
  checkbox: PropTypes.bool,
  chip: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};
