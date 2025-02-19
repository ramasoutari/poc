
// ----------------------------------------------------------------------

export function select(theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: "calc(50% - 9px)",
          color: theme.palette.primary.main,
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        icon: {
          right: 10,
          width: 18,
          height: 18,
          top: "calc(50% - 9px)",
          color: theme.palette.primary.main,
        },
      },
    },
  };
}
