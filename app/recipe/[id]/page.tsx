import Link from 'next/link'
import { recipes as mockRecipes } from '@/lib/recipes'
import { RecipeDetailClient } from './_components/RecipeDetailClient'

interface RecipePageProps {
  params: Promise<{ id: string }>
}

/**
 * Recipe Detail page — Server Component shell.
 *
 * Looks up the recipe by `id` from the static mock recipes list.
 * User-created recipes (from localStorage) are not available server-side,
 * so the client component handles the lookup for those via RecipeContext.
 *
 * Requirements: 3.1, 3.10
 */
export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { id } = await params

  // Try to find the recipe in mock recipes (available server-side)
  const mockRecipe = mockRecipes.find((r) => r.id === id) ?? null

  // If found in mock recipes, pass it directly to the client component.
  // If not found, the client component will check user recipes from localStorage.
  // If neither has it, the client component renders the "not found" state.
  return <RecipeDetailClient recipeId={id} initialRecipe={mockRecipe} />
}

/**
 * Generate static params for all mock recipes so they are pre-rendered.
 */
export function generateStaticParams() {
  return mockRecipes.map((recipe) => ({ id: recipe.id }))
}
