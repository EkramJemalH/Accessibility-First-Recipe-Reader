'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChefHat } from 'lucide-react'
import { useRecipeContext } from '@/context/RecipeContext'
import { filterRecipes, sortRecipes, type SortOption } from '@/lib/recipeFilters'
import { RecipeGrid } from '@/components/recipe-grid'

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryFilter = 'all' | 'breakfast' | 'lunch' | 'dinner'
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard'

// ─── FilterBar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  category: CategoryFilter
  difficulty: DifficultyFilter
  sort: SortOption
  onCategoryChange: (value: CategoryFilter) => void
  onDifficultyChange: (value: DifficultyFilter) => void
  onSortChange: (value: SortOption) => void
}

function FilterBar({
  category,
  difficulty,
  sort,
  onCategoryChange,
  onDifficultyChange,
  onSortChange,
}: FilterBarProps) {
  const selectClass =
    'rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div
      role="search"
      aria-label="Recipe filters"
      className="flex flex-wrap items-end gap-3"
    >
      {/* Category filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="category-filter" className="text-xs font-medium text-muted-foreground">
          Category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
          aria-label="Filter by category"
          className={selectClass}
        >
          <option value="all">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>

      {/* Difficulty filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="difficulty-filter" className="text-xs font-medium text-muted-foreground">
          Difficulty
        </label>
        <select
          id="difficulty-filter"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as DifficultyFilter)}
          aria-label="Filter by difficulty"
          className={selectClass}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Sort control */}
      <div className="flex flex-col gap-1">
        <label htmlFor="sort-control" className="text-xs font-medium text-muted-foreground">
          Sort by
        </label>
        <select
          id="sort-control"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort recipes"
          className={selectClass}
        >
          <option value="default">Default</option>
          <option value="time-asc">Cooking Time (shortest first)</option>
          <option value="time-desc">Cooking Time (longest first)</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <span className="text-5xl" aria-hidden="true">
        🍽️
      </span>
      <p className="text-lg font-medium text-foreground">No recipes found</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'No recipes are available yet. Check back soon!'}
      </p>
    </div>
  )
}

// ─── HomePageClient ───────────────────────────────────────────────────────────

export function HomePageClient() {
  const { allRecipes } = useRecipeContext()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Search query is synced with the URL ?q= param
  const urlQuery = searchParams.get('q') ?? ''

  // Local filter/sort state (not persisted in URL — only search query is)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [sort, setSort] = useState<SortOption>('default')

  // Push search query to URL so it's shareable and survives navigation
  const handleSearchChange = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.replace(`/?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Derive filtered + sorted recipe list
  const displayedRecipes = useMemo(
    () =>
      sortRecipes(
        filterRecipes(allRecipes, {
          query: urlQuery,
          category,
          difficulty,
        }),
        sort
      ),
    [allRecipes, urlQuery, category, difficulty, sort]
  )

  const hasActiveFilters =
    urlQuery.trim() !== '' || category !== 'all' || difficulty !== 'all'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ── Hero section ── */}
      <section aria-labelledby="hero-heading" className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <ChefHat className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1
            id="hero-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Accessibility-First Recipe Reader
          </h1>
        </div>
        <p className="max-w-2xl text-base text-muted-foreground">
          Browse, cook, and create recipes with deep accessibility support — voice guidance,
          high contrast, dyslexia-friendly mode, and more. Every recipe is designed to be
          enjoyed by everyone.
        </p>
      </section>

      {/* ── Filter bar ── */}
      <section aria-label="Search and filter recipes" className="mb-6">
        {/* Page-level search input (visible on all sizes, complements Navbar search) */}
        <div className="mb-4">
          <label htmlFor="page-search" className="sr-only">
            Search recipes
          </label>
          <div className="relative max-w-md">
            <input
              id="page-search"
              type="search"
              placeholder="Search recipes by name or description…"
              aria-label="Search recipes by name or description"
              defaultValue={urlQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-md border bg-input py-2 pl-4 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <FilterBar
          category={category}
          difficulty={difficulty}
          sort={sort}
          onCategoryChange={setCategory}
          onDifficultyChange={setDifficulty}
          onSortChange={setSort}
        />
      </section>

      {/* ── Results summary (screen-reader announcement) ── */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {displayedRecipes.length === 0
          ? 'No recipes match your current filters.'
          : `Showing ${displayedRecipes.length} recipe${displayedRecipes.length === 1 ? '' : 's'}.`}
      </div>

      {/* ── Recipe grid or empty state ── */}
      {displayedRecipes.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} />
      ) : (
        <RecipeGrid
          recipes={displayedRecipes}
          title={
            hasActiveFilters
              ? `${displayedRecipes.length} recipe${displayedRecipes.length === 1 ? '' : 's'} found`
              : 'All Recipes'
          }
        />
      )}
    </div>
  )
}
