'use client'

import { useEffect } from 'react'
import { useAccessibilityPreferences } from '@/hooks/use-accessibility-preferences'

export function AccessibilityWrapper({ children }: { children: React.ReactNode }) {
  const { preferences, isLoaded } = useAccessibilityPreferences()

  // Apply accessibility preferences to the document
  useEffect(() => {
    if (!isLoaded) return

    const html = document.documentElement

    // Set CSS custom properties for font scale and line height
    html.style.setProperty('--font-scale', preferences.fontSize === 'small' ? '0.9' : preferences.fontSize === 'large' ? '1.1' : '1')
    html.style.setProperty('--line-height', preferences.lineSpacing === 'relaxed' ? '1.8' : preferences.lineSpacing === 'extra' ? '2' : '1.6')

    // Update classes on document element
    html.classList.toggle('high-contrast', preferences.highContrast)
    html.classList.toggle('dyslexia-friendly', preferences.dyslexiaFriendly)
    html.classList.toggle('reduce-motion', preferences.reduceMotion)
  }, [preferences, isLoaded])

  return children
}
