import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
// hooks
// components
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';
import { usePathname } from '../../routes/hooks';
import { useResponsive } from '../../hooks/use-responsive';
import { useMockedUser } from '../../hooks/use-mocked-user';
import Scrollbar from '../../components/scrollbar';
import Logo from '../../components/logo';
import NavSectionVertical from '../../components/nav-section/vertical/nav-section-vertical';
import { useOnboardingTourContext } from '../../components/onboarding-tour/context/onboarding-tour-context';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();
  const onBoarding = useOnboardingTourContext();
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const renderContent = (
    <Scrollbar
      data-tour-id="drawer_tour"
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, mb: 1, mx: 'auto' }} />
      <NavSectionVertical
        data={navData}
        config={{
          currentRole: user?.role || 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      {/* <NavUpgrade /> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        backgroundColor: 'background.paper',
        // boxShadow: (theme) => theme.customShadows.z20,
        zIndex: 1101,
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            // borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              // hideBackdrop: true

            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  onCloseNav: PropTypes.func,
  openNav: PropTypes.bool,
};
