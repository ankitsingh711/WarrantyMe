import { useEffect, useRef } from 'react';

type AutoSaveCallback = () => Promise<void>;

export const useAutoSave = (callback: AutoSaveCallback, delay: number = 2000): AutoSaveCallback => {
  const savedCallback = useRef<AutoSaveCallback>(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const debouncedSave = async (): Promise<void> => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
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