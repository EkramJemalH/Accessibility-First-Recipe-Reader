'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * A generic hook for reading and writing a value to localStorage.
 *
 * @param key          The localStorage key to read/write.
 * @param defaultValue The value to use when the key is absent or unparseable.
 * @returns            A tuple of [value, setValue, isLoaded].
 *                     - `value`     — the current value (starts as defaultValue until mount)
 *                     - `setValue`  — updates React state and persists to localStorage
 *                     - `isLoaded`  — false until the initial useEffect has run, preventing
 *                                     SSR hydration mismatches
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  // Always start with defaultValue so SSR and the first client render match.
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // On mount, read the persisted value from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        setValue(JSON.parse(raw) as T)
      }
    } catch (e) {
      console.error(`[useLocalStorage] Failed to parse key "${key}":`, e)
      // Fall back to defaultValue — state is already set to it.
    } finally {
      setIsLoaded(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // A stable setter that updates React state and defers the localStorage write
  // to avoid triggering React warnings about side effects during render.
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue

        setTimeout(() => {
          try {
            localStorage.setItem(key, JSON.stringify(next))
          } catch (e) {
            console.error(`[useLocalStorage] Failed to write key "${key}":`, e)
          }
        }, 0)

        return next
      })
    },
    [key]
  )

  return [value, setStoredValue, isLoaded]
}
