'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Leaf, Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search-bar'
import { AccessibilityPanel } from '@/components/accessibility-panel'

export function Header() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [displayTheme, setDisplayTheme] = useState('light')
  const { theme, setTheme, systemTheme } = useTheme()

  // Ensure component only renders after hydration
  useEffect(() => {
    setMounted(true)
    // Determine which theme to display
    const effectiveTheme = theme === 'system' ? systemTheme : theme
    setDisplayTheme(effectiveTheme || 'light')
  }, [theme, systemTheme])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
        >
          <Leaf className="w-6 h-6 text-accent" aria-hidden="true" />
          <span className="text-foreground">Recipe Reader</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Accessibility Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            aria-label="Open accessibility settings"
            aria-expanded={isAccessibilityOpen}
            title="Accessibility Settings"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(displayTheme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${displayTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`${displayTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
          >
            {displayTheme === 'dark' ? (
              <Sun className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Accessibility Panel */}
      {isAccessibilityOpen && (
        <AccessibilityPanel onClose={() => setIsAccessibilityOpen(false)} />
      )}
    </header>
  )
}
