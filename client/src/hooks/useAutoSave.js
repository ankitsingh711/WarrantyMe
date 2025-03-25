import { useEffect, useRef } from 'react';

export const useAutoSave = (callback, delay = 2000) => {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const debouncedSave = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      savedCallback.current(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
}; 