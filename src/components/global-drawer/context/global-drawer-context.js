import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const GlobalDrawerContext = createContext({});

export const useGlobalDrawerContext = () => {
  const context = useContext(GlobalDrawerContext);

  if (!context) throw new Error('useGlobalDrawerContext must be use inside GlobalDrawerProvider');

  return context;
};
