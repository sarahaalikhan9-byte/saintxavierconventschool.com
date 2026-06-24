import { useEffect, useState } from 'react';

/**
 * This hook detects storage changes from other tabs/windows
 * Useful for syncing state across browser tabs
 */
export function useStorageSync(key: string, initialValue: any = null) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Failed to parse localStorage item:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Failed to parse storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return value;
}
