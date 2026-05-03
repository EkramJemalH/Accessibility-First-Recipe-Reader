'use client'

import { createContext, useContext, useCallback, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface FavoritesContextValue {
  /** Array of saved recipe IDs. */
  savedIds: string[]
  /** Toggle a recipe's saved state. Adds if not present, removes if present. */
  toggleSave: (id: string) => void
  /** Returns true if the given recipe ID is in the saved list. */
  isSaved: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>('saved_recipes', [])

  const toggleSave = useCallback(
    (id: string) => {
      setSavedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    },
    [setSavedIds]
  )

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  )

  const value: FavoritesContextValue = {
    savedIds,
    toggleSave,
    isSaved,
  }

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider')
  }
  return ctx
}
