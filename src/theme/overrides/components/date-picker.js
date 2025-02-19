import { buttonClasses } from "@mui/material/Button";
// components
import Iconify from "../../../components/iconify";
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const dateList = [
  "DatePicker",
  "DateTimePicker",
  "StaticDatePicker",
  "DesktopDatePicker",
  "DesktopDateTimePicker",
  //
  "MobileDatePicker",
  "MobileDateTimePicker",
];

const timeList = [
  "TimePicker",
  "MobileTimePicker",
  "StaticTimePicker",
  "DesktopTimePicker",
];

const switchIcon = () => <Iconify icon="eva:chevron-down-fill" width={24} />;

const leftIcon = () => <Iconify icon="eva:arrow-ios-back-fill" width={24} />;

const rightIcon = () => (
  <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
);

const calendarIcon = () => (
  <SvgColor
    src="/assets/icons/designer/calendar-2.svg"
    color="primary.main"
    sx={{
      width: 24,
    }}
  />
);

const clockIcon = () => (
  <SvgColor
    src="/assets/icons/designer/clock-2.svg"
    color="primary.main"
    sx={{
      width: 24,
    }}
  />
);

const desktopTypes = dateList.reduce((result, currentValue) => {
  result[`Mui${currentValue}`] = {
    defaultProps: {
      slots: {
        openPickerIcon: calendarIcon,
        leftArrowIcon: leftIcon,
        rightArrowIcon: rightIcon,
        switchViewIcon: switchIcon,
      },
    },
  };

  return result;
}, {});

const timeTypes = timeList.reduce((result, currentValue) => {
  result[`Mui${currentValue}`] = {
    defaultProps: {
      slots: {
        openPickerIcon: clockIcon,
        rightArrowIcon: rightIcon,
        switchViewIcon: switchIcon,
      },
    },
  };

  return result;
}, {});

export function datePicker(theme) {
  return {
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          "& .MuiPickersLayout-actionBar": {
            [`& .${buttonClasses.root}:last-of-type`]: {
              backgroundColor: theme.palette.text.primary,
              color:
                theme.palette.mode === "light"
                  ? theme.palette.common.white
                  : theme.palette.grey[800],
            },
          },
        },
      },
    },

    // Date
    ...desktopTypes,

    // Time
    ...timeTypes,
  };
}
