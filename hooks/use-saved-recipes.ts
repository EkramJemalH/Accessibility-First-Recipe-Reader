'use client'

import { useState, useEffect, useCallback } from 'react'

export function useSavedRecipes() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saved_recipes')
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved recipes', e)
      }
    }
  }, [])

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) 
        ? prev.filter((i) => i !== id) 
        : [...prev, id]
      
      // Defer side effects to avoid React warning about updating other components during render
      setTimeout(() => {
        localStorage.setItem('saved_recipes', JSON.stringify(next))
        window.dispatchEvent(new Event('saved_recipes_updated'))
      }, 0)
      
      return next
    })
  }, [])

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds])

  return { savedIds, toggleSave, isSaved }
}
