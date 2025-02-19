import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
// _mock
// components
import { useBoolean } from '../../hooks/use-boolean';
import { useResponsive } from '../../hooks/use-responsive';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function CustomDrawer({
  open,
  backdrop,
  closeOnBackdrop,
  anchor,
  title,
  renderRightOptions,
  onClose,
  children,
}) {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>

      {renderRightOptions}

      {!smUp && (
        <IconButton onClick={onClose || drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open || drawer.value}
        onClose={closeOnBackdrop ? onClose || drawer.onFalse : undefined}
        anchor={anchor || 'right'}
        slotProps={{
          backdrop: { invisible: !backdrop || false },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: "sm" },
        }}
      >
        {renderHead}
        <Divider />

        {children}
      </Drawer>
    </>
  );
}

CustomDrawer.propTypes = {
  open: PropTypes.bool,
  backdrop: PropTypes.bool,
  closeOnBackdrop: PropTypes.bool,
  onClose: PropTypes.func,
  anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  title: PropTypes.string,
  renderRightOptions: PropTypes.node,
  children: PropTypes.node,
};

CustomDrawer.defaultProps = {
  open: false,
  backdrop: false,
  closeOnBackdrop: false,
  anchor: 'right',
  onClose: () => {},
  title: '',
  renderRightOptions: null,
  children: null,
};
