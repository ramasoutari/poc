import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const AccessibilityContext = createContext({});

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);

  if (!context) throw new Error('useAccessibilityContext must be use inside AccessibilityProvider');

  return context;
};
