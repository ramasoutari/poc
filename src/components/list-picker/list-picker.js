import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Checkbox,
  FormHelperText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

export default function ListPicker({
  error,
  items = [],
  checked = [],
  onChange,
  helperText,
  sx,
  getOptionLabel,
  getOptionValue,
  ...other
}) {
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

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onChange(newChecked);
  };

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        p: 0,
        ...sx,
      }}
      {...other}
    >
      {items?.map((item, index) => {
        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(handleGetOptionValue(item))}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(handleGetOptionValue(item)) !== -1}
                  color="secondary"
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={handleGetOptionLabel(item)} />
            </ListItemButton>
          </ListItem>
        );
      })}
      {(!!error || helperText) && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
    </List>
  );
}

ListPicker.propTypes = {
  error: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  checked: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  sx: PropTypes.object,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
};
