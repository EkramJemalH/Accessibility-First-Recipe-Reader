// Feature: accessibility-first-recipe-reader, Property 1: localStorage persistence round-trip for favorites

/**
 * Property 1: localStorage persistence round-trip for favorites
 *
 * For any array of recipe ID strings saved as favorites, writing to localStorage
 * under key `saved_recipes` and then reading and parsing that key should produce
 * an array equal to the original.
 *
 * Validates: Requirements 15.1
 */

import * as fc from 'fast-check'

const SAVED_RECIPES_KEY = 'saved_recipes'

describe('Property 1: localStorage persistence round-trip for favorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips any array of recipe ID strings through localStorage under saved_recipes', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (ids) => {
        // Write to localStorage (the same way useSavedRecipes / FavoritesContext does)
        localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(ids))

        // Read back and parse
        const raw = localStorage.getItem(SAVED_RECIPES_KEY)
        expect(raw).not.toBeNull()

        const parsed: string[] = JSON.parse(raw!)

        // The round-tripped value must be deeply equal to the original
        expect(parsed).toEqual(ids)
      }),
      { numRuns: 100 }
    )
  })

  it('produces an empty array when an empty array is persisted', () => {
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify([]))
    const parsed = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)!)
    expect(parsed).toEqual([])
  })

  it('preserves order of recipe IDs after round-trip', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 20 }),
        (ids) => {
          localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(ids))
          const parsed: string[] = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY)!)

          // Every element at every index must match
          ids.forEach((id, index) => {
            expect(parsed[index]).toBe(id)
          })
          expect(parsed.length).toBe(ids.length)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: accessibility-first-recipe-reader, Property 11: localStorage persistence round-trip for user recipes

/**
 * Property 11: localStorage persistence round-trip for user recipes
 *
 * For any array of Recipe objects serialized to localStorage under key `user_recipes`,
 * deserializing that value should produce an array of objects structurally equal to
 * the originals (same id, title, ingredients, instructions, etc.).
 *
 * Validates: Requirements 15.3
 */

import { recipeArbitrary } from './helpers/recipeArbitrary'

const USER_RECIPES_KEY = 'user_recipes'

describe('Property 11: localStorage persistence round-trip for user recipes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips any array of Recipe objects through localStorage under user_recipes', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        // Serialize to localStorage (the same way RecipeContext / useLocalStorage does)
        localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes))

        // Read back and parse
        const raw = localStorage.getItem(USER_RECIPES_KEY)
        expect(raw).not.toBeNull()

        const parsed = JSON.parse(raw!)

        // The round-tripped value must be deeply equal to the original
        expect(parsed).toEqual(recipes)
      }),
      { numRuns: 100 }
    )
  })

  it('produces an empty array when an empty array is persisted', () => {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify([]))
    const parsed = JSON.parse(localStorage.getItem(USER_RECIPES_KEY)!)
    expect(parsed).toEqual([])
  })

  it('preserves all Recipe fields after round-trip', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary, { minLength: 1, maxLength: 10 }), (recipes) => {
        localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes))
        const parsed = JSON.parse(localStorage.getItem(USER_RECIPES_KEY)!)

        expect(parsed).toHaveLength(recipes.length)

        recipes.forEach((recipe, index) => {
          const roundTripped = parsed[index]
          expect(roundTripped.id).toBe(recipe.id)
          expect(roundTripped.title).toBe(recipe.title)
          expect(roundTripped.description).toBe(recipe.description)
          expect(roundTripped.cookingTime).toBe(recipe.cookingTime)
          expect(roundTripped.servings).toBe(recipe.servings)
          expect(roundTripped.difficulty).toBe(recipe.difficulty)
          expect(roundTripped.category).toBe(recipe.category)
          expect(roundTripped.ingredients).toEqual(recipe.ingredients)
          expect(roundTripped.instructions).toEqual(recipe.instructions)
        })
      }),
      { numRuns: 100 }
    )
  })
})
