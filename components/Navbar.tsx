"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, User, Settings, X, ChefHat } from "lucide-react";

export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus mobile input when it opens
  useEffect(() => {
    if (mobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  // Memoized search handler avoids unnecessary re-renders
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    []
  );

  // Submit search (used on form submit / Enter key for both desktop and mobile)
  const submitSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = searchQuery.trim();
      if (trimmed) {
        router.push(`/?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/");
      }
      // Close mobile search after submission
      setMobileSearchOpen(false);
    },
    [searchQuery, router]
  );

  const handleMobileSearchClose = useCallback(() => {
    setMobileSearchOpen(false);
    setSearchQuery("");
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Accessibility-First Recipe Reader home"
          className="flex shrink-0 items-center gap-2 font-bold text-primary"
        >
          <ChefHat className="h-6 w-6" aria-hidden="true" />
          <span className="hidden sm:inline">Recipe Reader</span>
        </Link>

        {/* Desktop search (wrapped in form for Enter key) */}
        <form
          onSubmit={submitSearch}
          className="hidden flex-1 sm:flex"
          role="search"
        >
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="desktop-search" className="sr-only">
              Search recipes
            </label>
            <input
              id="desktop-search"
              type="search"
              placeholder="Search recipes…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border bg-input py-2 pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </form>

        {/* Spacer for mobile layout */}
        <div className="flex-1 sm:hidden" />

        {/* Action icons */}
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
            aria-expanded={mobileSearchOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link
            href="/favorites"
            aria-label="Favorites"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>

          <Link
            href="/settings"
            aria-label="Settings"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <form
          onSubmit={submitSearch}
          role="search"
          aria-label="Mobile search"
          className="absolute inset-x-0 top-0 z-50 flex h-16 items-center gap-2 border-b bg-background px-4 sm:hidden"
        >
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="mobile-search-input" className="sr-only">
            Search recipes
          </label>
          <input
            ref={mobileInputRef}
            id="mobile-search-input"
            type="search"
            placeholder="Search recipes…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={handleMobileSearchClose}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      )}
    </header>
  );
}