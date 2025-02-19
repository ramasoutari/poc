import { Box, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledActionButton = styled(Button)(({ variant, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(variant === 'outlined' && {
    borderColor: theme.palette.divider,
  }),
  borderRadius: theme.spacing(1),
}));

export const StyledActionIconButton = styled(IconButton)(({ variant, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.secondary.main,
  ...(variant === 'outlined' && {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.divider}`,
  }),
  borderRadius: theme.spacing(1),
  padding: `${theme.spacing(0.625)} ${theme.spacing(1.5)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    ...(variant === 'outlined' && {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.common.white,
    }),
  },
  '& .svg-color': {
    width: '18px',
    color: 'inherit',
  },
}));
