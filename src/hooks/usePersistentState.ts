import { useEffect, useState } from 'react';

export function usePersistentState<T>(key: string, initialValue: () => T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        // fall through to default
      }
    }
    return initialValue();
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
