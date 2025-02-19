import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { useRouter } from '../../../routes/hooks';
// hooks
//

// ----------------------------------------------------------------------

export function OnboardingTourProvider({ children }) {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const currentPathName = useRef(router.pathname);

  // ** Functions
  const onStart = useCallback((val) => {
    setIsStarted(true);
    setSteps(val);
  }, []);

  const onNext = useCallback(() => {
    setStepIndex((prev) => prev + 1);
  }, []);

  const onPrev = useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const onReset = useCallback(() => {
    setStepIndex(0);
  }, []);

  const onStop = useCallback(() => {
    setIsStarted(false);
    setStepIndex(0);
    setSteps([]);
  }, []);

  // ** Effects
  useEffect(() => {
    // reset on route change
    if (!isEqual(currentPathName.current, router.pathname)) {
      onStop();
      currentPathName.current = router.pathname;
    }
  }, [router.pathname, onStop]);

  // useEffect(() => {
  //   if (steps[stepIndex]?.callback && typeof steps[stepIndex].callback === "function") {
  //     steps[stepIndex].callback();
  //   }
  // }, [stepIndex])

  const memoizedValue = useMemo(
    () => ({
      isStarted,
      stepIndex,
      steps,
      onStart,
      onNext,
      onPrev,
      onReset,
      onStop,
    }),
    [isStarted, stepIndex, steps, onStart, onNext, onPrev, onReset, onStop]
  );

  return (
    <OnboardingTourContext.Provider value={memoizedValue}>
      {children}
    </OnboardingTourContext.Provider>
  );
}

OnboardingTourProvider.propTypes = {
  children: PropTypes.node,
};
