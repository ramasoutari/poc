import { useEffect, useRef } from 'react';

export function useSkipFirstRender(func, deps = []) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {

      func();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

}
