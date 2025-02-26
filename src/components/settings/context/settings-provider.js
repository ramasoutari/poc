import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useCallback, useState } from 'react';
// hooks
// utils
//
import { SettingsContext } from './settings-context';
import { useLocalStorage } from '../../../hooks/use-local-storage';
import { localStorageGetItem } from '../../../utils/storage-available';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'settings';

export function SettingsProvider({ children, defaultSettings }) {
  const { state, update, reset } = useLocalStorage(STORAGE_KEY, defaultSettings);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [pageSpacingActive, setPageSpacingActive] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [backRoute, setBackRoute] = useState(null);

  const isArabic = localStorageGetItem('i18nextLng') === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang) => {
      update('themeDirection', lang === 'ar' ? 'rtl' : 'ltr');
    },
    [update]
  );

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  // Page Spacing
  const onEnablePageSpacing = useCallback(() => {
    setPageSpacingActive(true);
  }, []);
  // Nav
  const onShowNav = useCallback(() => {
    setHideNav(false);
  }, []);

  const onHideNav = useCallback(() => {
    setHideNav(true);
  }, []);

  const onDisablePageSpacing = useCallback(() => {
    setPageSpacingActive(false);
  }, []);

  // Back Route
  const onSetBackRoute = useCallback((route) => {
    setBackRoute(route);
  }, []);

  const onResetBackRoute = useCallback(() => {
    setBackRoute(null);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: update,
      // Direction
      onChangeDirectionByLang,
      // Reset
      canReset,
      onReset: reset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
      // Page spacing
      pageSpacing: pageSpacingActive,
      onEnablePageSpacing,
      onDisablePageSpacing,
      // Nav
      hideNav,
      onShowNav,
      onHideNav,
      // Back Route
      backRoute,
      onSetBackRoute,
      onResetBackRoute,
    }),
    [
      reset,
      update,
      state,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      onChangeDirectionByLang,
      pageSpacingActive,
      onEnablePageSpacing,
      onDisablePageSpacing,
      hideNav,
      onShowNav,
      onHideNav,
      backRoute,
      onSetBackRoute,
      onResetBackRoute,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}

SettingsProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
