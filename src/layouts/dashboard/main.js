import PropTypes from 'prop-types'; // @mui
import { useEffect } from 'react';
import Box from '@mui/material/Box';
// hooks
// components
//
import { HEADER, NAV } from '../config-layout';
import ChangePasswordDialog from '../_common/change-password-dialog';
import { useSettingsContext } from '../../components/settings/context';
import { useResponsive } from '../../hooks/use-responsive';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const pageSpacing = settings.pageSpacing;

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          // mt: 4,
          pt: pageSpacing ? `${HEADER.H_MOBILE + 24 + 0}px` : `${24 + HEADER.H_MOBILE}px`,
          pb: pageSpacing ? 10 : 0,
          ...(lgUp && {
            pt: pageSpacing
              ? `${HEADER.H_MOBILE * 2 + 40}px`
              : `${HEADER.H_MOBILE * (settings.hideNav ? 1 : 2)}px`,
            pb: pageSpacing ? 15 : 0,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        mt: 4,
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 1,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {/* <ChangePasswordDialog /> */}
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
