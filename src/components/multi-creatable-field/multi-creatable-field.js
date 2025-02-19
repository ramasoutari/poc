import React, { useEffect, useRef, useState } from "react";
// @mui
import { TextField, Autocomplete, createFilterOptions } from "@mui/material";
// locales
import { useLocales } from "../../locales";

const filter = createFilterOptions();

export default function MultiSelectCreatable({ value, onChange }) {
  const { t } = useLocales();
  const mounted = useRef(false);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([value]);
  }, [value]);

  useEffect(() => {
    if (mounted.current) {
      onChange(selected);
    }
    mounted.current = true;
  }, [selected]);

  return (
    <Autocomplete
      value={selected}
      multiple
      onChange={(event, newValue, reason, details) => {
        if (details?.option.create && reason !== "removeOption") {
          setSelected([...selected, details.option.name]);
        } else {
          setSelected(
            newValue.map((value) => {
              if (typeof value === "string") {
                return details?.option.create ? details.option.name : value;
              } else {
                return value;
              }
            })
          );
        }
      }}
      filterSelectedOptions
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            name: inputValue,
            label: `${t("add")} "${inputValue}"`,
            create: true,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.label) {
          return option.name;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => (
        <li {...props}>{option.create ? option.label : option.name}</li>
      )}
      freeSolo
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
