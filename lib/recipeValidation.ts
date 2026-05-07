/**
 * Pure validation function for the Create Recipe form.
 * Returns an errors object with an entry for each empty required field.
 * Returns {} when all required fields are present and non-empty.
 *
 * Requirements: 7.7
 */

export interface RecipeFormData {
  title?: string
  description?: string
  category?: string
  difficulty?: string
  cookingTime?: number | string | null
  servings?: number | string | null
  ingredients?: { name: string; amount: string }[]
  instructions?: string[]
}

export interface RecipeFormErrors {
  title?: string
  description?: string
  category?: string
  difficulty?: string
  cookingTime?: string
  servings?: string
}

/**
 * Validates a partial recipe form object.
 * Returns an errors object with an entry for each empty required field.
 * Returns {} when all required fields are present and non-empty.
 */
export function validateRecipeForm(data: Partial<RecipeFormData>): RecipeFormErrors {
  const errors: RecipeFormErrors = {}

  if (!data.title || String(data.title).trim() === '') {
    errors.title = 'Title is required'
  }

  if (!data.description || String(data.description).trim() === '') {
    errors.description = 'Description is required'
  }

  if (!data.category || String(data.category).trim() === '') {
    errors.category = 'Category is required'
  }

  if (!data.difficulty || String(data.difficulty).trim() === '') {
    errors.difficulty = 'Difficulty is required'
  }

  if (
    data.cookingTime === undefined ||
    data.cookingTime === null ||
    data.cookingTime === '' ||
    (typeof data.cookingTime === 'number' && isNaN(data.cookingTime))
  ) {
    errors.cookingTime = 'Cooking time is required'
  }

  if (
    data.servings === undefined ||
    data.servings === null ||
    data.servings === '' ||
    (typeof data.servings === 'number' && isNaN(data.servings))
  ) {
    errors.servings = 'Servings is required'
  }

  return errors
}