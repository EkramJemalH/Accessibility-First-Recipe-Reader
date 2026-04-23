'use client'

import { useState, useEffect } from 'react'

export type FontSize = 'small' | 'normal' | 'large'
export type LineSpacing = 'normal' | 'relaxed' | 'extra'

export interface AccessibilityPreferences {
  fontSize: FontSize
  lineSpacing: LineSpacing
  highContrast: boolean
  dyslexiaFriendly: boolean
  reduceMotion: boolean
}

const STORAGE_KEY = 'accessibility-preferences'

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  fontSize: 'normal',
  lineSpacing: 'normal',
  highContrast: false,
  dyslexiaFriendly: false,
  reduceMotion: false,
}

const FONT_SCALE_MAP: Record<FontSize, number> = {
  small: 0.9,
  normal: 1,
  large: 1.1,
}

const LINE_HEIGHT_MAP: Record<LineSpacing, number> = {
  normal: 1.6,
  relaxed: 1.8,
  extra: 2,
}

export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse accessibility preferences:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Persist preferences to localStorage
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences, isLoaded])

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES)
  }

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded,
  }
}
