'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { useRecipeContext } from '@/context/RecipeContext'
import { RecipeForm } from '@/app/create/_components/RecipeForm'

/**
 * Edit Recipe page — auth-gated, user-recipes only.
 *
 * Redirects to /login if not authenticated.
 * Redirects to the recipe detail page if the recipe is a mock recipe
 * (mock recipes cannot be edited).
 * Shows a "not found" state if the recipe doesn't exist.
 */
export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : ''

  const { isAuthenticated } = useAuthContext()
  const { allRecipes, userRecipes } = useRecipeContext()

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const recipe = allRecipes.find((r) => r.id === recipeId) ?? null
  const isUserRecipe = recipe ? userRecipes.some((r) => r.id === recipe.id) : false

  // Recipe not found
  if (!recipe) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <span className="text-6xl" aria-hidden="true">🍽️</span>
        <h1 className="text-2xl font-bold text-foreground">Recipe not found</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  // Mock recipes cannot be edited
  if (!isUserRecipe) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <span className="text-6xl" aria-hidden="true">🔒</span>
        <h1 className="text-2xl font-bold text-foreground">Cannot edit this recipe</h1>
        <p className="max-w-sm text-muted-foreground">
          Only recipes you created can be edited.
        </p>
        <Link
          href={`/recipe/${recipeId}`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Recipe
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href={`/recipe/${recipeId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to recipe
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Recipe</h1>
        <p className="mt-2 text-muted-foreground">
          Update the details for <span className="font-medium text-foreground">{recipe.title}</span>.
        </p>
      </header>

      <RecipeForm initialRecipe={recipe} />
    </div>
  )
}
