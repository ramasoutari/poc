import { useEffect, useState } from 'react';
import { useSettingsContext } from '../components/settings/context';

// ----------------------------------------------------------------------

export function useBackRoute(route,show = false) {
  const settings = useSettingsContext();

  useEffect(() => {
    if(show === true)
    settings.onSetBackRoute(route);

    return () => {
      settings.onResetBackRoute();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
}
