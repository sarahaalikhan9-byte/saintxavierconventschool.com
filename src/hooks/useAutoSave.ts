import { useEffect, useRef } from 'react';

/**
 * This hook manages auto-save functionality for form data
 * Automatically saves data to localStorage at specified intervals
 */
export function useAutoSave(key: string, data: any, interval: number = 5000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to auto-save data:', error);
      }
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, interval]);
}
