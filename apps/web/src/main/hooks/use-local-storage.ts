"use client";
import { useState, useEffect, useCallback } from "react";
import z from "zod";

type UseLocalStorageOptions<T> = {
  key: string;
  schema: z.ZodSchema<T>;
  initialValue: T;
};

export function useLocalStorage<T>({ key, schema, initialValue }: UseLocalStorageOptions<T>): [T, (newValue: T) => void] {
  // 1) Lazy, schema-validated initial state with fallback to initialValue
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    const str = localStorage.getItem(key);
    if (!str) return initialValue;
    try {
      const json = JSON.parse(str);
      const parsed = schema.safeParse(json);
      return parsed.success ? parsed.data : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 2) Stable setter that validates before updating
  const changeValue = useCallback(
    (newValue: T) => {
      const result = schema.safeParse(newValue);
      if (result.success) {
        setValue(result.data);
      }
    },
    [schema]
  );

  // 3) Persist every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // 4) Cross-tab sync (resets to initialValue if cleared)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      if (e.newValue === null) {
        setValue(initialValue);
      } else {
        try {
          const json = JSON.parse(e.newValue);
          const parsed = schema.safeParse(json);
          if (parsed.success) setValue(parsed.data);
        } catch {
          // ignore invalid JSON
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, schema, initialValue]);

  return [value, changeValue];
}
