import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
//
import { varContainer } from './variants';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function MotionContainer({ animate, action = false, children, ...other }) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? 'animate' : 'exit'}
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}

MotionContainer.propTypes = {
  action: PropTypes.bool,
  animate: PropTypes.bool,
  children: PropTypes.node,
};
