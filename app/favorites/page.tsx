'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useFavoritesContext } from '@/context/FavoritesContext'
import { useRecipeContext } from '@/context/RecipeContext'
import { RecipeCard } from '@/components/RecipeCard'

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-20 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Heart illustration */}
      <div
        aria-hidden="true"
        className="flex h-24 w-24 items-center justify-center rounded-full bg-muted"
      >
        <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-foreground">No favorites yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Start exploring recipes and save your favorites here
        </p>
      </div>

      {/* Link to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Browse Recipes
      </Link>
    </div>
  )
}

// ─── FavoritesPage ────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  const { savedIds } = useFavoritesContext()
  const { allRecipes } = useRecipeContext()

  // Derive favorite recipes by filtering allRecipes against savedIds
  const favoriteRecipes = allRecipes.filter((recipe) =>
    savedIds.includes(recipe.id)
  )

  return (
    <main id="main-content">
      <div className="container mx-auto px-4 py-8">
        {/* Page heading — announced to screen readers via <h1> */}
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My Favorites
        </h1>

        {favoriteRecipes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Screen-reader announcement of count */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {`Showing ${favoriteRecipes.length} saved recipe${favoriteRecipes.length === 1 ? '' : 's'}.`}
            </div>

            {/* Recipe grid — 1 col mobile, 2 col tablet, 3 col desktop */}
            <ul
              role="list"
              aria-label="Saved recipes"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {favoriteRecipes.map((recipe) => (
                <li key={recipe.id}>
                  {/*
                   * RecipeCard already renders the favorites toggle button via
                   * FavoritesContext. When the recipe is saved (as it always is
                   * on this page), the toggle shows as active/pressed and
                   * toggling it removes the recipe from favorites — satisfying
                   * Requirements 6.3 and 6.4.
                   */}
                  <RecipeCard recipe={recipe} showFavoriteButton={true} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}
