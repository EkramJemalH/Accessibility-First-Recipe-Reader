'use client'

/**
 * Reading Mode page — distraction-free, continuous-scroll recipe view.
 *
 * Features:
 * - Full-screen fixed overlay that covers the root layout's Navbar/BottomNav
 * - Fixed floating toolbar: font size +/-, dark/light mode toggle, exit button
 * - Local --font-scale CSS variable applied to reading content
 * - Max content width of 720px centered on the page
 * - All toolbar buttons have aria-label attributes
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10
 */

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useRecipeContext } from '@/context/RecipeContext'
import { clampFontScale } from '@/lib/fontScale'
import { Sun, Moon, ZoomIn, ZoomOut, X } from 'lucide-react'

const FONT_SCALE_STEP = 0.1

export default function ReadingModePage() {
  const params = useParams()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { allRecipes } = useRecipeContext()

  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  const recipe = allRecipes.find((r) => r.id === id) ?? null

  // Local font scale state — independent of global accessibility preferences
  const [fontScale, setFontScale] = useState(1.0)

  const handleIncreaseFontSize = () => {
    setFontScale((prev) => clampFontScale(prev, +FONT_SCALE_STEP))
  }

  const handleDecreaseFontSize = () => {
    setFontScale((prev) => clampFontScale(prev, -FONT_SCALE_STEP))
  }

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleExit = () => {
    router.push(`/recipe/${id}`)
  }

  // Recipe not found state
  if (!recipe) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        role="main"
      >
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Recipe not found.</p>
          <button
            onClick={() => router.push('/')}
            className="text-primary underline hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Go back to home page"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    /*
     * Full-screen fixed overlay — covers the root layout's Navbar and BottomNav,
     * providing a distraction-free reading environment (Requirement 5.2).
     */
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background text-foreground"
      role="main"
      aria-label={`Reading mode: ${recipe.title}`}
    >
      {/* ── Floating Toolbar ── */}
      <div
        className="fixed top-4 right-4 z-60 flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm"
        role="toolbar"
        aria-label="Reading mode controls"
      >
        {/* Font size decrease */}
        <button
          onClick={handleDecreaseFontSize}
          aria-label="Decrease font size"
          disabled={fontScale <= 0.8}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Font scale indicator */}
        <span
          className="min-w-[3rem] text-center text-xs font-medium tabular-nums text-muted-foreground"
          aria-live="polite"
          aria-label={`Current font scale: ${Math.round(fontScale * 100)}%`}
        >
          {Math.round(fontScale * 100)}%
        </span>

        {/* Font size increase */}
        <button
          onClick={handleIncreaseFontSize}
          aria-label="Increase font size"
          disabled={fontScale >= 1.5}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        {/* Dark/light mode toggle */}
        <button
          onClick={handleToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

        {/* Exit reading mode */}
        <button
          onClick={handleExit}
          aria-label={`Exit reading mode, return to ${recipe.title} recipe page`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Reading Content ── */}
      {/*
       * Apply local --font-scale CSS variable to the reading content wrapper.
       * The content uses max-w-[720px] centered for optimal readability (Req 5.8).
       * Top padding accounts for the fixed toolbar.
       */}
      <div
        className="mx-auto max-w-[720px] px-6 pb-16 pt-20"
        style={{ '--font-scale': fontScale } as React.CSSProperties}
      >
        {/* Recipe title */}
        <h1
          className="mb-4 font-bold leading-tight tracking-tight"
          style={{ fontSize: `calc(2rem * var(--font-scale, 1))` }}
        >
          {recipe.title}
        </h1>

        {/* Meta info */}
        <div
          className="mb-6 flex flex-wrap gap-4 text-muted-foreground"
          style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}
        >
          <span>
            <span className="font-medium text-foreground">Time:</span>{' '}
            {recipe.cookingTime} min
          </span>
          <span>
            <span className="font-medium text-foreground">Servings:</span>{' '}
            {recipe.servings}
          </span>
          <span>
            <span className="font-medium text-foreground">Difficulty:</span>{' '}
            <span className="capitalize">{recipe.difficulty}</span>
          </span>
          <span>
            <span className="font-medium text-foreground">Category:</span>{' '}
            <span className="capitalize">{recipe.category}</span>
          </span>
        </div>

        {/* Description */}
        <p
          className="mb-8 leading-relaxed text-muted-foreground"
          style={{ fontSize: `calc(1rem * var(--font-scale, 1))` }}
        >
          {recipe.description}
        </p>

        {/* Divider */}
        <hr className="mb-8 border-border" />

        {/* Ingredients */}
        <section aria-labelledby="reading-ingredients-heading" className="mb-10">
          <h2
            id="reading-ingredients-heading"
            className="mb-4 font-semibold"
            style={{ fontSize: `calc(1.5rem * var(--font-scale, 1))` }}
          >
            Ingredients
          </h2>
          <ul
            role="list"
            className="space-y-2"
            style={{ fontSize: `calc(1rem * var(--font-scale, 1))` }}
          >
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-baseline gap-2 border-b border-border/50 pb-2 last:border-0"
              >
                <span className="font-medium">{ingredient.amount}</span>
                <span className="text-muted-foreground">{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section aria-labelledby="reading-instructions-heading" className="mb-10">
          <h2
            id="reading-instructions-heading"
            className="mb-4 font-semibold"
            style={{ fontSize: `calc(1.5rem * var(--font-scale, 1))` }}
          >
            Instructions
          </h2>
          <ol
            className="space-y-4"
            style={{ fontSize: `calc(1rem * var(--font-scale, 1))` }}
          >
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tips (optional) */}
        {recipe.tips && recipe.tips.length > 0 && (
          <section aria-labelledby="reading-tips-heading" className="mb-10">
            <h2
              id="reading-tips-heading"
              className="mb-4 font-semibold"
              style={{ fontSize: `calc(1.5rem * var(--font-scale, 1))` }}
            >
              Tips
            </h2>
            <ul
              role="list"
              className="space-y-2"
              style={{ fontSize: `calc(1rem * var(--font-scale, 1))` }}
            >
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex gap-2 leading-relaxed">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Exit link at bottom for keyboard users */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <button
            onClick={handleExit}
            className="text-primary underline hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Exit reading mode, return to ${recipe.title} recipe page`}
            style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}
          >
            ← Back to recipe
          </button>
        </div>
      </div>
    </div>
  )
}
