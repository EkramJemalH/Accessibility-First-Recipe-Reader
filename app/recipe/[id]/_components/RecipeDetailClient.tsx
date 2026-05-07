'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  Users,
  Heart,
  ChefHat,
  BookOpen,
  Lightbulb,
  Trash2,
  Pencil,
} from 'lucide-react'
import { useRecipeContext } from '@/context/RecipeContext'
import { useFavoritesContext } from '@/context/FavoritesContext'
import type { Recipe } from '@/lib/recipes'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecipeDetailClientProps {
  recipeId: string
  /** Recipe pre-fetched server-side (mock recipes only). Null for user recipes. */
  initialRecipe: Recipe | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<Recipe['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const DIFFICULTY_LABELS: Record<Recipe['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const CATEGORY_LABELS: Record<Recipe['category'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-4 w-4" />
        </li>
        <li>
          <span aria-current="page" className="text-foreground font-medium line-clamp-1">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  )
}

// ─── IngredientsChecklist ─────────────────────────────────────────────────────

function IngredientsChecklist({
  ingredients,
}: {
  ingredients: Recipe['ingredients']
}) {
  // Checked state persisted in component state for session duration (Req 3.3)
  const [checked, setChecked] = useState<boolean[]>(() =>
    ingredients.map(() => false)
  )

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <section aria-labelledby="ingredients-heading" className="mb-8">
      <h2
        id="ingredients-heading"
        className="mb-4 text-xl font-semibold text-foreground"
      >
        Ingredients
      </h2>
      {/* role="list" on <ul> satisfies Req 3.13 */}
      <ul role="list" className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const inputId = `ingredient-${index}`
          const isChecked = checked[index]
          return (
            <li key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={inputId}
                checked={isChecked}
                onChange={() => toggle(index)}
                className="h-4 w-4 shrink-0 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {/* label associated with checkbox via htmlFor (Req 3.13) */}
              <label
                htmlFor={inputId}
                className={[
                  'cursor-pointer text-sm transition-colors select-none',
                  isChecked
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground',
                ].join(' ')}
              >
                <span className="font-medium">{ingredient.amount}</span>{' '}
                {ingredient.name}
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ─── InstructionsList ─────────────────────────────────────────────────────────

function InstructionsList({ instructions }: { instructions: string[] }) {
  return (
    <section aria-labelledby="instructions-heading" className="mb-8">
      <h2
        id="instructions-heading"
        className="mb-4 text-xl font-semibold text-foreground"
      >
        Instructions
      </h2>
      <ol className="space-y-4">
        {instructions.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
            >
              {index + 1}
            </span>
            <p className="pt-0.5 text-sm leading-relaxed text-foreground">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── TipsSection ─────────────────────────────────────────────────────────────

function TipsSection({ tips }: { tips: string[] }) {
  return (
    <section aria-labelledby="tips-heading" className="mb-8">
      <h2
        id="tips-heading"
        className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground"
      >
        <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
        Tips
      </h2>
      <ul role="list" className="space-y-2">
        {tips.map((tip, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-md bg-muted/50 px-4 py-3 text-sm text-foreground"
          >
            <span aria-hidden="true" className="shrink-0 text-yellow-500">
              💡
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── NotFound ─────────────────────────────────────────────────────────────────

function RecipeNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <span className="text-6xl" aria-hidden="true">
        🍽️
      </span>
      <h1 className="text-2xl font-bold text-foreground">Recipe not found</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find the recipe you&apos;re looking for. It may have
        been removed or the link might be incorrect.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to Home
      </Link>
    </div>
  )
}

// ─── RecipeDetailClient ───────────────────────────────────────────────────────

/**
 * Recipe Detail client component.
 *
 * Handles:
 * - Resolving user recipes from RecipeContext (not available server-side)
 * - Breadcrumb navigation (Req 3.11)
 * - Hero image, title, meta badges (Req 3.1, 3.12)
 * - Action buttons: Cooking Mode, Reading Mode, Favorites toggle (Req 3.6, 3.7, 3.8, 3.9)
 * - Ingredients checklist with checkbox state (Req 3.2, 3.3, 3.13)
 * - Ordered instructions list (Req 3.4)
 * - Optional tips section (Req 3.5)
 * - "Recipe not found" state (Req 3.10)
 * - Delete button for user-created recipes
 *
 * Requirements: 3.1–3.9, 3.11–3.13
 */
export function RecipeDetailClient({
  recipeId,
  initialRecipe,
}: RecipeDetailClientProps) {
  const router = useRouter()
  const { allRecipes, userRecipes, deleteRecipe } = useRecipeContext()
  const { isSaved, toggleSave } = useFavoritesContext()

  // Confirm-delete state
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Resolve recipe: prefer server-provided initial, fall back to context lookup
  // (covers user-created recipes stored in localStorage)
  const recipe =
    initialRecipe ?? allRecipes.find((r) => r.id === recipeId) ?? null

  const saved = recipe ? isSaved(recipe.id) : false

  // True only for recipes the current user created (not mock recipes)
  const isUserRecipe = recipe
    ? userRecipes.some((r) => r.id === recipe.id)
    : false

  const handleDelete = () => {
    if (!recipe) return
    deleteRecipe(recipe.id)
    router.push('/')
  }

  // Show not-found state if recipe doesn't exist in either source (Req 3.10)
  if (!recipe) {
    return <RecipeNotFound />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation (Req 3.11) */}
      <Breadcrumb title={recipe.title} />

      {/* ── Hero section ── */}
      <section aria-labelledby="recipe-title" className="mb-8">
        {/* Hero image (Req 3.1, 3.12) — falls back to a placeholder when no image URL is set */}
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-muted">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Title (Req 3.1) */}
        <h1
          id="recipe-title"
          className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {recipe.title}
        </h1>

        {/* Description */}
        <p className="mb-4 text-base text-muted-foreground leading-relaxed">
          {recipe.description}
        </p>

        {/* Meta badges row (Req 3.1) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Cooking time */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>
              <span className="sr-only">Cooking time: </span>
              {recipe.cookingTime} min
            </span>
          </div>

          {/* Servings */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>
              <span className="sr-only">Servings: </span>
              {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Difficulty badge — color + text (not color-only) */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${DIFFICULTY_COLORS[recipe.difficulty]}`}
          >
            <span className="sr-only">Difficulty: </span>
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>

          {/* Category badge — icon + text label (not color-only, Req 13.6) */}
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <span aria-hidden="true">🍽️</span>
            <span className="sr-only">Category: </span>
            {CATEGORY_LABELS[recipe.category]}
          </span>
        </div>
      </section>

      {/* ── Action buttons ── */}
      <section aria-label="Recipe actions" className="mb-8 flex flex-wrap gap-3">
        {/* Start Cooking Mode (Req 3.6) */}
        <Link
          href={`/recipe/${recipe.id}/cooking`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Start cooking mode for ${recipe.title}`}
        >
          <ChefHat className="h-4 w-4" aria-hidden="true" />
          Start Cooking Mode
        </Link>

        {/* Reading Mode (Req 3.7) */}
        <Link
          href={`/recipe/${recipe.id}/reading`}
          className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open reading mode for ${recipe.title}`}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Reading Mode
        </Link>

        {/* Favorites toggle (Req 3.8, 3.9) */}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${recipe.title} from favorites`
              : `Add ${recipe.title} to favorites`
          }
          onClick={() => toggleSave(recipe.id)}
          className={[
            'inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            saved
              ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-border bg-background text-foreground hover:bg-muted',
          ].join(' ')}
        >
          <Heart
            className="h-4 w-4"
            aria-hidden="true"
            fill={saved ? 'currentColor' : 'none'}
          />
          {saved ? 'Saved to Favorites' : 'Add to Favorites'}
        </button>

        {/* Edit + Delete — only shown for user-created recipes */}
        {isUserRecipe && (
          <>
            {/* Edit Recipe */}
            <Link
              href={`/recipe/${recipe.id}/edit`}
              aria-label={`Edit ${recipe.title}`}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Recipe
            </Link>

            {/* Delete Recipe */}
            {confirmDelete ? (
              <div
                role="group"
                aria-label="Confirm recipe deletion"
                className="flex items-center gap-2"
              >
                <span className="text-sm text-muted-foreground">Delete this recipe?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label={`Confirm delete ${recipe.title}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  aria-label="Cancel deletion"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete ${recipe.title}`}
                className="inline-flex items-center gap-2 rounded-md border border-destructive/50 bg-background px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete Recipe
              </button>
            )}
          </>
        )}
      </section>

      {/* ── Two-column layout on larger screens ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: ingredients */}
        <div className="lg:col-span-1">
          <IngredientsChecklist ingredients={recipe.ingredients} />
        </div>

        {/* Right column: instructions + tips */}
        <div className="lg:col-span-2">
          <InstructionsList instructions={recipe.instructions} />
          {recipe.tips && recipe.tips.length > 0 && (
            <TipsSection tips={recipe.tips} />
          )}
        </div>
      </div>
    </div>
  )
}
