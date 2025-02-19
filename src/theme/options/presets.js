// @mui
import { alpha } from '@mui/material/styles';
// theme

// ----------------------------------------------------------------------

export function presets(presetsColor) {
  const primary = primaryPresets.find((i) => i.name === presetsColor);

  const theme = {
    palette: {
      primary,
    },
    customShadows: {
      primary: `0 8px 16px 0 ${alpha(`${primary?.main}`, 0.24)}`,
    },
  };

  return theme;
}

// ----------------------------------------------------------------------

// const palette = themePalette('light');

export const primaryPresets = [
  // DEFAULT
  // {
  //   name: 'default',
  //   ...palette.primary,
  // },
  // PATRON
  {
    name: "patron",
    light: "#91E0EF",
    lighter: "#D1E9FC",
    main: "#02045F",
    dark: "#103996",
    darker: "#061B64",
    contrastText: "#FFFFFF",
  },
  // JIACC
  {
    name: "jiacc",
    lighter: "#8a3c33",
    light: "#7c231a",
    main: "#6D0B00",
    dark: "#4c0800",
    darker: "#370600",
    contrastText: "#FFFFFF",
  },
  // MOH
  {
    name: "moh",
    lighter: "#ED8539",
    light: "#ED8539",
    main: "#ED8539",
    dark: "#ED8539",
    darker: "#ED8539",
    contrastText: "#FFFFFF",
  },
  // CYAN
  {
    name: "cyan",
    lighter: "#CCF4FE",
    light: "#68CDF9",
    main: "#078DEE",
    dark: "#0351AB",
    darker: "#012972",
    contrastText: "#FFFFFF",
  },
  // PURPLE
  {
    name: "purple",
    lighter: "#EBD6FD",
    light: "#B985F4",
    main: "#7635dc",
    dark: "#431A9E",
    darker: "#200A69",
    contrastText: "#FFFFFF",
  },
  // BLUE
  {
    name: "blue",
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#2065D1",
    dark: "#103996",
    darker: "#061B64",
    contrastText: "#FFFFFF",
  },
  // ORANGE
  {
    name: "orange",
    lighter: "##ED8539",
    light: "#ED8539",
    main: "#ED8539",
    dark: "#ED8539",
    darker: "#ED8539",
    contrastText: "#FFFFFF",
  },
  // RED
  {
    name: "red",
    lighter: "#FFE3D5",
    light: "#FFC1AC",
    main: "#FF3030",
    dark: "#B71833",
    darker: "#7A0930",
    contrastText: "#FFFFFF",
  },
];
