// Feature: accessibility-first-recipe-reader
// Shared fast-check arbitrary for generating valid Recipe objects used across all property tests

import * as fc from 'fast-check'
import type { Recipe } from '@/lib/recipes'

/**
 * A fast-check arbitrary that generates valid Recipe objects matching the Recipe type
 * defined in lib/recipes.ts. Used as a shared test helper across all property-based tests.
 */
export const recipeArbitrary: fc.Arbitrary<Recipe> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  description: fc.string(),
  image: fc.webUrl(),
  cookingTime: fc.integer({ min: 1, max: 300 }),
  servings: fc.integer({ min: 1, max: 20 }),
  difficulty: fc.constantFrom('easy', 'medium', 'hard') as fc.Arbitrary<'easy' | 'medium' | 'hard'>,
  category: fc.constantFrom('breakfast', 'lunch', 'dinner') as fc.Arbitrary<'breakfast' | 'lunch' | 'dinner'>,
  ingredients: fc.array(fc.record({ name: fc.string(), amount: fc.string() })),
  instructions: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
})
