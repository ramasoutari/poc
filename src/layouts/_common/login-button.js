import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
// routes
// config
import { RouterLink } from '../../routes/components';
import { PATH_AFTER_LOGIN } from '../../config-global';

// ----------------------------------------------------------------------

export default function LoginButton({ sx }) {
  return (
    <Button component={RouterLink} href={PATH_AFTER_LOGIN} variant="outlined" sx={{ mr: 1, ...sx }}>
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
