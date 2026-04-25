'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAccessibilityPreferences, type FontSize, type LineSpacing } from '@/hooks/use-accessibility-preferences'

interface AccessibilityPanelProps {
  onClose: () => void
}

export function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const { preferences, updatePreference, resetPreferences, isLoaded } = useAccessibilityPreferences()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus management
  useEffect(() => {
    if (panelRef.current) {
      const firstButton = panelRef.current.querySelector('button')
      firstButton?.focus()
    }
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <div className="border-t border-border bg-card" ref={panelRef} role="region" aria-label="Accessibility settings">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Accessibility Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Font Size */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Text Size
            </label>
            <div className="flex gap-2">
              {(['small', 'normal', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updatePreference('fontSize', size as FontSize)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    preferences.fontSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-pressed={preferences.fontSize === size}
                >
                  {size === 'small' ? 'A−' : size === 'normal' ? 'A' : 'A+'}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Line Spacing
            </label>
            <div className="flex gap-2">
              {(['normal', 'relaxed', 'extra'] as const).map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => updatePreference('lineSpacing', spacing as LineSpacing)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    preferences.lineSpacing === spacing
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-pressed={preferences.lineSpacing === spacing}
                >
                  {spacing === 'normal' ? 'Normal' : spacing === 'relaxed' ? 'Relaxed' : 'Extra'}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              High Contrast
            </label>
            <div className="flex items-center h-10">
              <button
                onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  preferences.highContrast
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                role="switch"
                aria-checked={preferences.highContrast}
                aria-label="Toggle high contrast mode"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-background transition-transform ${
                    preferences.highContrast ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Dyslexia Friendly */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Dyslexia Mode
            </label>
            <div className="flex items-center h-10">
              <button
                onClick={() => updatePreference('dyslexiaFriendly', !preferences.dyslexiaFriendly)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  preferences.dyslexiaFriendly
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                role="switch"
                aria-checked={preferences.dyslexiaFriendly}
                aria-label="Toggle dyslexia-friendly mode"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-background transition-transform ${
                    preferences.dyslexiaFriendly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Reduce Motion
            </label>
            <div className="flex items-center h-10">
              <button
                onClick={() => updatePreference('reduceMotion', !preferences.reduceMotion)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  preferences.reduceMotion
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                role="switch"
                aria-checked={preferences.reduceMotion}
                aria-label="Toggle reduce motion"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-background transition-transform ${
                    preferences.reduceMotion ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={resetPreferences}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}
