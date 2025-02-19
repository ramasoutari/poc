import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
// hooks
//
import { varContainer } from './variants';
import { Box } from '@mui/material';
import { useResponsive } from '../../hooks/use-responsive';

// ----------------------------------------------------------------------

export default function MotionViewport({ children, disableAnimatedMobile = true, ...other }) {
  const smDown = useResponsive('down', 'sm');

  if (smDown && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}

MotionViewport.propTypes = {
  children: PropTypes.node,
  disableAnimatedMobile: PropTypes.bool,
};
