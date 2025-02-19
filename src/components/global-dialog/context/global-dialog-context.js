import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const GlobalDialogContext = createContext({});

export const useGlobalDialogContext = () => {
  const context = useContext(GlobalDialogContext);

  if (!context) throw new Error('useGlobalDialogContext must be use inside GlobalDialogProvider');

  return context;
};
