'use client'

import { createContext, useContext, ReactNode } from 'react'
import {
  useAccessibilityPreferences,
  AccessibilityPreferences,
} from '@/hooks/use-accessibility-preferences'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Extend the base preferences type to include voiceEnabled
export interface ExtendedAccessibilityPreferences extends AccessibilityPreferences {
  voiceEnabled: boolean
}

export interface AccessibilityContextValue {
  preferences: ExtendedAccessibilityPreferences
  updatePreference: <K extends keyof ExtendedAccessibilityPreferences>(
    key: K,
    value: ExtendedAccessibilityPreferences[K]
  ) => void
  resetPreferences: () => void
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  isLoaded: boolean
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

const STORAGE_KEY = 'accessibility-preferences'

const DEFAULT_EXTENDED_PREFERENCES: ExtendedAccessibilityPreferences = {
  fontSize: 'normal',
  lineSpacing: 'normal',
  highContrast: false,
  dyslexiaFriendly: false,
  reduceMotion: false,
  voiceEnabled: false,
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Use useLocalStorage directly so we can manage the full extended preferences
  // (including voiceEnabled) under the same key as the base hook.
  const [storedPrefs, setStoredPrefs, isLoaded] = useLocalStorage<ExtendedAccessibilityPreferences>(
    STORAGE_KEY,
    DEFAULT_EXTENDED_PREFERENCES
  )

  // Merge stored prefs with defaults to handle cases where voiceEnabled
  // wasn't present in previously-stored data.
  const preferences: ExtendedAccessibilityPreferences = {
    ...DEFAULT_EXTENDED_PREFERENCES,
    ...storedPrefs,
  }

  const updatePreference = <K extends keyof ExtendedAccessibilityPreferences>(
    key: K,
    value: ExtendedAccessibilityPreferences[K]
  ) => {
    setStoredPrefs((prev) => ({ ...DEFAULT_EXTENDED_PREFERENCES, ...prev, [key]: value }))
  }

  const resetPreferences = () => {
    setStoredPrefs(DEFAULT_EXTENDED_PREFERENCES)
  }

  const setVoiceEnabled = (enabled: boolean) => {
    updatePreference('voiceEnabled', enabled)
  }

  const value: AccessibilityContextValue = {
    preferences,
    updatePreference,
    resetPreferences,
    voiceEnabled: preferences.voiceEnabled,
    setVoiceEnabled,
    isLoaded,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityContext(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider')
  }
  return ctx
}
