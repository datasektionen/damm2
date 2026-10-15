import { useCallback, useEffect, useSyncExternalStore } from 'react';

const useScreenSizeChecker = (breakpoint: number) => {
  const query = `(max-width: ${breakpoint}px)`;

  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query]
  );

  const small = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    localStorage.setItem('isSmallScreen', small + '');
  }, [small]);

  return small;
};

export default useScreenSizeChecker;
