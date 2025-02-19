import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import MuiTouchRipple from '@mui/material/ButtonBase/TouchRipple';

export default function TouchRipple({ children }) {
  const rippleRef = useRef(null);

  const onRippleStart = (e) => {
    rippleRef.current.start(e);
  };
  const onRippleStop = (e) => {
    rippleRef.current.stop(e);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={onRippleStart}
      onMouseUp={onRippleStop}
      style={{
        display: 'inline-block',
        padding: 8,
        position: 'relative',
        border: 'black solid 1px',
      }}
    >
      <MuiTouchRipple ref={rippleRef} center={false} />
      {children}
    </div>
  );
}

TouchRipple.propTypes = {
  children: PropTypes.node.isRequired,
};
