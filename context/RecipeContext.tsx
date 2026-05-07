'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { Recipe, recipes as mockRecipes } from '@/lib/recipes'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface RecipeContextValue {
  /** Recipes created by the current user, persisted in localStorage. */
  userRecipes: Recipe[]
  /** All recipes: mock recipes followed by user-created recipes. */
  allRecipes: Recipe[]
  /** Create a new recipe with a generated ID and persist it. Returns the created recipe. */
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Recipe
  /** Update an existing user-created recipe by ID. No-op if the ID belongs to a mock recipe. */
  updateRecipe: (id: string, updates: Omit<Recipe, 'id'>) => void
  /** Remove a user-created recipe by ID. No-op if the ID belongs to a mock recipe. */
  deleteRecipe: (id: string) => void
}

const RecipeContext = createContext<RecipeContextValue | null>(null)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [userRecipes, setUserRecipes] = useLocalStorage<Recipe[]>('user_recipes', [])

  // Derived: mock recipes first, then user recipes
  const allRecipes = useMemo(
    () => [...mockRecipes, ...userRecipes],
    [userRecipes]
  )

  const addRecipe = (recipeData: Omit<Recipe, 'id'>): Recipe => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: crypto.randomUUID(),
    }
    setUserRecipes((prev) => [...prev, newRecipe])
    return newRecipe
  }

  const deleteRecipe = (id: string): void => {
    setUserRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRecipe = (id: string, updates: Omit<Recipe, 'id'>): void => {
    setUserRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...updates, id } : r))
    )
  }

  const value: RecipeContextValue = {
    userRecipes,
    allRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

export function useRecipeContext(): RecipeContextValue {
  const ctx = useContext(RecipeContext)
  if (!ctx) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return ctx
}
