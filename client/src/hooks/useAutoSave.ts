import { useEffect, useRef } from 'react';

type AutoSaveCallback = (...args: any[]) => Promise<void>;

export const useAutoSave = (callback: AutoSaveCallback, delay: number = 2000) => {
  const savedCallback = useRef<AutoSaveCallback>(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const debouncedSave = (...args: any[]): void => {
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