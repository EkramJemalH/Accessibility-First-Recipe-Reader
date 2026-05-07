'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useFavoritesContext } from '@/context/FavoritesContext'
import type { Recipe } from '@/lib/recipes'

interface RecipeCardProps {
  recipe: Recipe
  /** Whether to show the favorites toggle button. Defaults to true. */
  showFavoriteButton?: boolean
  /**
   * Pass `true` for cards that are above the fold (e.g. the first 1–2 cards
   * in the grid). This sets `loading="eager"` and adds a `<link rel="preload">`
   * in the document head, eliminating the LCP warning for those images.
   */
  priority?: boolean
}

/** Maps difficulty to a Tailwind color class for the badge background. */
const DIFFICULTY_COLORS: Record<Recipe['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

/** Human-readable difficulty labels. */
const DIFFICULTY_LABELS: Record<Recipe['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function RecipeCard({ recipe, showFavoriteButton = true, priority = false }: RecipeCardProps) {
  const { isSaved, toggleSave } = useFavoritesContext()
  const saved = isSaved(recipe.id)

  return (
    <article
      aria-label={recipe.title}
      className="relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Main card link — wraps image + text content */}
      <Link
        href={`/recipe/${recipe.id}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        tabIndex={0}
      >
        {/* Recipe image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={priority}
          />
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Title */}
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-card-foreground">
            {recipe.title}
          </h2>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {recipe.description}
          </p>

          {/* Meta row */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            {/* Cooking time */}
            <span className="text-xs text-muted-foreground">
              {recipe.cookingTime} min
            </span>

            {/* Servings */}
            <span className="text-xs text-muted-foreground">
              · {recipe.servings} servings
            </span>

            {/* Difficulty badge — color + text label (not color-only) */}
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[recipe.difficulty]}`}
            >
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </span>
          </div>
        </div>
      </Link>

      {/* Favorites toggle — outside the main link to avoid nested interactive elements */}
      {showFavoriteButton && (
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
          onClick={() => toggleSave(recipe.id)}
          className={[
            'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            saved
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground',
          ].join(' ')}
        >
          <Heart
            className="h-4 w-4"
            aria-hidden="true"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      )}
    </article>
  )
}
