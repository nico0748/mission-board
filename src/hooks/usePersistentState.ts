import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function usePersistentState<T>(key: string, initialValue: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        console.error(`Failed to parse stored value for key "${key}"`);
      }
    }
    return initialValue();
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
