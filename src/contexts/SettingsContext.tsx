import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import type { Role } from '../types';

export type ThemeKey = 'warm' | 'cool' | 'dark';

type SettingsContextType = {
  role: Role;
  setRole: (r: Role) => void;
  adminPin: string;
  setAdminPin: (p: string) => void;
  requestAdminMode: () => void;
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  boardInterval: number;
  setBoardInterval: (n: number) => void;
  tickerDuration: number;
  setTickerDuration: (n: number) => void;
  resetData: () => void;
  registerResetData: (fn: () => void) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('general');
  const [adminPin, setAdminPin] = usePersistentState<string>('adminPin', () => '2468');
  const [theme, setTheme] = usePersistentState<ThemeKey>('theme', () => 'warm');
  const [boardInterval, setBoardInterval] = usePersistentState<number>('boardInterval', () => 10);
  const [tickerDuration, setTickerDuration] = usePersistentState<number>('tickerDuration', () => 30);
  const resetDataRef = useRef<() => void>(() => {});

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const requestAdminMode = useCallback(() => {
    if (role === 'admin') return;
    const input = prompt('Admin PIN を入力してください');
    if (input === null) return;
    if (input === adminPin) {
      setRole('admin');
    } else {
      alert('PIN が違います');
    }
  }, [role, adminPin]);

  const resetData = useCallback(() => {
    resetDataRef.current();
  }, []);

  const registerResetData = useCallback((fn: () => void) => {
    resetDataRef.current = fn;
  }, []);

  return (
    <SettingsContext.Provider value={{
      role, setRole, adminPin, setAdminPin, requestAdminMode,
      theme, setTheme, boardInterval, setBoardInterval,
      tickerDuration, setTickerDuration,
      resetData, registerResetData,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
