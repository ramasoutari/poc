// ----------------------------------------------------------------------

export function cssBaseline(theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          transition: theme.transitions.create('font-size', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shortest,
          }),
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root, #__next': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          maxWidth: '100%',
          display: 'inline-block',
          verticalAlign: 'bottom',
        },
        'a:not(.MuiButtonBase-root)': {
          color: theme.palette.secondary.main,
          '&:hover': {
            color: theme.palette.secondary.dark,
          },
        },
      },
    },
  };
}
