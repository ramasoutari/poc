import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// SETUP COLORS

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#323A45",
  800: "#212B36",
  900: "#231F20",
};

const PRIMARY = {
  lighter: "#ED8539",
  light: "#ED8539",
  main: "#ED8539",
  dark: "#891711",
  darker: "#1D3E6E",
  contrastText: "#FFFFFF",
};

const SECONDARY = {
  lighter: "#ED8539",
  light: "#ED8539",
  main: "#ED8539",
  dark: "#ab8b3b",
  darker: "#987b35",
  contrastText: "#FFFFFF",
};

const SECONDARY_WHITE = {
  lighter: "#FFFFFF",
  light: "#FFFFFF",
  main: "#FFFFFF",
  dark: "#F6F6F6",
  darker: "#F2F2F2",
  contrastText: SECONDARY.main,
};

const TERTIARY = {
  lighter: "#ED8539",
  light: "#ED8539",
  main: "#ED8539",
  dark: "#5119B7",
  darker: "#27097A",
  contrastText: "#FFFFFF",
};

const INFO = {
  lighter: "#ED8539",
  light: "#ED8539",
  main: "#ED8539",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#FFFFFF",
};

const SUCCESS = {
  lighter: "#ED8539",
  light: "#ED8539",
  main: "#ED8539",
  dark: "#118D57",
  darker: "#065E49",
  contrastText: "#ffffff",
};

const WARNING = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: GREY[800],
};

const ERROR = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#FF5630",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#FFFFFF",
};

const COMMON = {
  common: {
    black: "#000000",
    white: "#FFFFFF",
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  secondaryWhite: SECONDARY_WHITE,
  tertiary: TERTIARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export function palette(mode) {
  const light = {
    ...COMMON,
    mode: "light",
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: "#FFFFFF",
      default: "#F6F6F6",
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: "dark",
    text: {
      primary: "#FFFFFF",
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return mode === "light" ? light : dark;
}
