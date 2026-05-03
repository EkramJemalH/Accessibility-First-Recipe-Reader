'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Heart, User, Settings, X, ChefHat } from 'lucide-react'

export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus the mobile search input when it opens
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus()
    }
  }, [mobileSearchOpen])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/')
    }
  }

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip to main content — first focusable element on every page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Left: Logo */}
        <Link
          href="/"
          aria-label="Accessibility-First Recipe Reader home"
          className="flex shrink-0 items-center gap-2 font-bold text-primary"
        >
          <ChefHat className="h-6 w-6" aria-hidden="true" />
          <span className="hidden sm:inline">Recipe Reader</span>
        </Link>

        {/* Center: Desktop search input (hidden below 640px) */}
        <div className="hidden flex-1 sm:flex">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search recipes…"
              aria-label="Search recipes"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border bg-input py-2 pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Spacer on mobile when search is closed */}
        <div className="flex-1 sm:hidden" />

        {/* Right: Icon buttons */}
        <nav aria-label="Main navigation actions" className="flex items-center gap-1">
          {/* Mobile search toggle (visible below 640px) */}
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Favorites */}
          <Link
            href="/favorites"
            aria-label="Favorites"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Settings (hidden below 768px per requirement 1.7 / 14.7) */}
          <Link
            href="/settings"
            aria-label="Settings"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>

      {/* Mobile full-width search overlay (visible below 640px when open) */}
      {mobileSearchOpen && (
        <div
          role="search"
          aria-label="Mobile search"
          className="absolute inset-x-0 top-0 z-50 flex h-16 items-center gap-2 border-b bg-background px-4 sm:hidden"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={mobileInputRef}
            type="search"
            placeholder="Search recipes…"
            aria-label="Search recipes"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={handleMobileSearchClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </header>
  )
}
