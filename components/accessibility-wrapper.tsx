'use client'

import { useEffect } from 'react'
import { useAccessibilityContext } from '@/context/AccessibilityContext'

export function AccessibilityWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { preferences, isLoaded } = useAccessibilityContext()

  useEffect(() => {
    if (!isLoaded) return

    const html = document.documentElement

    const fontScaleMap: Record<string, string> = {
      small: '0.9',
      normal: '1',
      large: '1.1',
    }

    const lineHeightMap: Record<string, string> = {
      normal: '1.6',
      relaxed: '1.8',
      extra: '2',
    }

    html.style.setProperty(
      '--font-scale',
      fontScaleMap[preferences.fontSize] ?? '1'
    )

    html.style.setProperty(
      '--line-height',
      lineHeightMap[preferences.lineSpacing] ?? '1.6'
    )

    html.classList.toggle('high-contrast', preferences.highContrast)
    html.classList.toggle('dyslexia-friendly', preferences.dyslexiaFriendly)
    html.classList.toggle('reduce-motion', preferences.reduceMotion)
  }, [preferences, isLoaded])

  return <>{children}</>
}
