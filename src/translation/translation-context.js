import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const TranslationContext = createContext({});

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);

  if (!context) throw new Error('useTranslationContext must be use inside TranslationProvider');

  return context;
};
