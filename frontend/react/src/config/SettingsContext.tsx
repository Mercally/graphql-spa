import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_BACKEND, DEFAULT_MODE } from './env';
import type { BackendKey, DataMode } from './env';

const BACKEND_STORAGE_KEY = 'poc.backend';
const MODE_STORAGE_KEY = 'poc.mode';

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return (value as T) ?? fallback;
}

interface SettingsContextValue {
  backend: BackendKey;
  mode: DataMode;
  setBackend: (backend: BackendKey) => void;
  setMode: (mode: DataMode) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [backend, setBackendState] = useState<BackendKey>(() =>
    readStored(BACKEND_STORAGE_KEY, DEFAULT_BACKEND)
  );
  const [mode, setModeState] = useState<DataMode>(() => readStored(MODE_STORAGE_KEY, DEFAULT_MODE));

  const setBackend = useCallback((next: BackendKey) => {
    setBackendState(next);
    window.localStorage.setItem(BACKEND_STORAGE_KEY, next);
  }, []);

  const setMode = useCallback((next: DataMode) => {
    setModeState(next);
    window.localStorage.setItem(MODE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ backend, mode, setBackend, setMode }),
    [backend, mode, setBackend, setMode]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
