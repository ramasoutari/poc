import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller } from "react-hook-form";
import _ from "lodash";
import { useRequest } from "alova";
// @mui
import Checkbox from "@mui/material/Checkbox";
// locales
// // api
// components
import { CircularProgress, FormControlLabel, Stack } from "@mui/material";
import { optionsFromAPISourceGetter } from "../../utils/api";
import { useLocales } from "../../locales";

// ----------------------------------------------------------------------

export function RHFMultiCheckBox({
  name,
  row,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  isAffectedByOtherFields,
  affectingFields,
  optionsSourceType,
  optionsSourceApi,
  optionsSourceApiToken,
  optionsSourceApiDataKey,
  optionsSourceApiValueKey,
  optionsSourceApiLabelKey,
  excludedValues = [],
  options: manualOptions,
  placeholder,
  nullable,
  getOptionLabel,
  getOptionValue,
  sx,
  required,
  ...other
}) {
  const renderCount = useRef(0)
  const { t } = useLocales();
  const {
    loading,
    send,
    data: options,
    update
  } = useRequest(
    (params) =>
      optionsFromAPISourceGetter(
        optionsSourceApi,
        // "",
        params,
        optionsSourceApiDataKey,
        optionsSourceApiLabelKey,
        optionsSourceApiValueKey,
        // "appendUrl"
      ),
    {
      immediate: false,
      initialData: manualOptions || [],
    }
  );

  // ** RHF
  const { control, getValues, setValue } = useFormContext();

  const valuesOfAffectingFields = affectingFields?.map((field) =>
    getValues(field.fieldName)
  );

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

  useEffect(() => {
    renderCount.current += 1;
    if (optionsSourceType === "api") {
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
            setValue(`${name}_hasOptions`, true)
          } else {
            setValue(`${name}_hasOptions`, false)
          }
        })
      };

      fetchOptions();
    }

    // when the value of one affectingFields field changes, we need to reset the value of the current field
    // only after second render, because first and second render are use to setup fields
    // third render is for user interactions
    if (isAffectedByOtherFields && renderCount.current > 2) {
      setValue(name, []);
      setValue(name + '_label', "")
      setValue(`${name}_hasOptions`, false)
      update({
        data: []
      })
    }

  }, [
    // whenever the value of affectingFields changes, we need to fetch the options again
    // so we add affectingFields to the dependency array
    _.join(valuesOfAffectingFields, ","),
  ]);

  useEffect(() => {
    if (getValues(name) && options.length > 0) {
      setValue(`${name}_label`, t('all'))
    }
  }, [getValues(name), options])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {loading && (
            <CircularProgress
              size={18}
              sx={{
                mx: 1,
              }}
            />
          )}
          <Stack direction={
            row ? "row" : "column"
          } flexWrap='wrap'>
            {!loading &&
              options
                .filter(item =>
                  !excludedValues.includes(
                    getOptionValue(item)
                  )
                )
                .map((option) => {
                  const isSelected = () => {
                    return field.value.includes(handleGetOptionValue(option))
                  };

                  return (
                    <FormControlLabel
                      key={handleGetOptionValue(option)}
                      control={
                        <Checkbox
                          checked={isSelected()}
                          value={handleGetOptionValue(option)}
                          onChange={(e) => {
                            let exists = field.value.findIndex(item => item === e.target.value) > -1
                            if (exists) {
                              field?.onChange(field.value.filter(item => item !== e.target.value))
                            } else {
                              field?.onChange([...field.value, e.target.value])
                            }
                          }}
                        />
                      }
                      label={handleGetOptionLabel(option)}
                      {...other}
                    />
                  );
                })}
          </Stack>
        </>
      )
      }
    />
  );
}

RHFMultiCheckBox.propTypes = {
  PaperPropsSx: PropTypes.object,
  children: PropTypes.node,
  helperText: PropTypes.string,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  row: PropTypes.bool,
  optionsSourceType: PropTypes.oneOf(["manual", "api"]),
  optionsSourceApi: PropTypes.string,
  optionsSourceApiToken: PropTypes.string,
  optionsSourceApiDataKey: PropTypes.string,
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
