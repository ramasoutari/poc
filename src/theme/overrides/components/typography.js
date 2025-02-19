// ----------------------------------------------------------------------

export function typography(theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
        body1: {
          [theme.breakpoints.down("md")]: {
            fontSize: ".75rem"
          }
        },
        body2: {
          [theme.breakpoints.down("md")]: {
            fontSize: ".75rem"
          }
        },
        caption: {
          [theme.breakpoints.down("md")]: {
            fontSize: ".75rem"
          }
        },
      },
    },
  };
}
