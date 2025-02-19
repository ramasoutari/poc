import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const SvgColor = forwardRef(({ src, width, sx, color, ...other }, ref) => {
  const isInheritColor = color === 'inherit' || color === 'currentColor' || !color;

  return (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: width || 24,
        height: width || 24,
        display: 'inline-block',
        color: isInheritColor ? 'currentColor' : color,
        bgcolor: isInheritColor ? 'currentColor' : color,
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  );
});

SvgColor.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object,
  color: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SvgColor;
