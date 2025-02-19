import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const OnboardingTourContext = createContext({});

export const useOnboardingTourContext = () => {
  const context = useContext(OnboardingTourContext);

  if (!context)
    throw new Error('useOnboardingTourContext must be use inside OnboardingTourProvider');

  return context;
};
