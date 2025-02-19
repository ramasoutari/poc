import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const GlobalPromptContext = createContext({});

export const useGlobalPromptContext = () => {
  const context = useContext(GlobalPromptContext);

  if (!context) throw new Error('useGlobalPromptContext must be use inside GlobalPromptProvider');

  return context;
};
