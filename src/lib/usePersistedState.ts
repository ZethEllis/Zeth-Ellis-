"use client";

import { useEffect, useState } from "react";

/** useState that survives reloads via localStorage. Renders `initial` first, then loads, so SSR output matches. */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      // storage unavailable or corrupt: keep the initial value
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota/private-mode errors
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
