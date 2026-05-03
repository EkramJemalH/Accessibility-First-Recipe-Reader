// Feature: accessibility-first-recipe-reader, Property 3: Recipe search filter correctness

/**
 * Property 3: Recipe search filter correctness
 *
 * For any list of recipes and any non-empty search query string, the filtered result
 * should contain only recipes whose `title` or `description` contains the query string
 * (case-insensitive), and every recipe in the original list that matches should appear
 * in the result.
 *
 * Validates: Requirements 2.3
 */

import * as fc from 'fast-check'
import { filterRecipes } from '@/lib/recipeFilters'
import { recipeArbitrary } from './helpers/recipeArbitrary'

describe('Property 3: Recipe search filter correctness', () => {
  it('returns only recipes whose title or description contains the query (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        // Constrain to non-whitespace-only queries: the implementation trims the query
        // and treats whitespace-only queries as "no filter" (same as empty string).
        fc.string({ minLength: 1 }).filter((s) => s.trim() !== ''),
        (recipes, query) => {
          const result = filterRecipes(recipes, { query })
          const lowerQuery = query.toLowerCase()

          // Every recipe in the result must match the query in title or description
          for (const recipe of result) {
            const matchesTitle = recipe.title.toLowerCase().includes(lowerQuery)
            const matchesDescription = recipe.description.toLowerCase().includes(lowerQuery)
            expect(matchesTitle || matchesDescription).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes every matching recipe from the original list', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        // Constrain to non-whitespace-only queries (whitespace-only is treated as no filter)
        fc.string({ minLength: 1 }).filter((s) => s.trim() !== ''),
        (recipes, query) => {
          const result = filterRecipes(recipes, { query })
          const lowerQuery = query.toLowerCase()
          const resultIds = new Set(result.map((r) => r.id))

          // Every recipe in the original list that matches must appear in the result
          for (const recipe of recipes) {
            const matchesTitle = recipe.title.toLowerCase().includes(lowerQuery)
            const matchesDescription = recipe.description.toLowerCase().includes(lowerQuery)
            if (matchesTitle || matchesDescription) {
              expect(resultIds.has(recipe.id)).toBe(true)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns all recipes when query is empty (no filtering applied)', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const result = filterRecipes(recipes, { query: '' })
        expect(result).toHaveLength(recipes.length)
      }),
      { numRuns: 100 }
    )
  })

  it('is case-insensitive: uppercase query matches lowercase title/description', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary, { minLength: 1 }),
        (recipes) => {
          // Pick the first recipe's title as the query, uppercased
          const query = recipes[0].title.toUpperCase()
          const result = filterRecipes(recipes, { query })

          // The first recipe must appear in the result (its title matches case-insensitively)
          const resultIds = new Set(result.map((r) => r.id))
          expect(resultIds.has(recipes[0].id)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('returns an empty array when no recipes match the query', () => {
    // Use a query that is guaranteed not to appear in any generated recipe
    // by using a string that contains a null-byte character (never in fc.string titles)
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        // A query with a character sequence extremely unlikely to appear in generated titles
        const impossibleQuery = '\x00\x01\x02'
        const result = filterRecipes(recipes, { query: impossibleQuery })
        expect(result).toHaveLength(0)
      }),
      { numRuns: 100 }
    )
  })

  it('does not mutate the original recipes array', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.string({ minLength: 1 }).filter((s) => s.trim() !== ''),
        (recipes, query) => {
          const originalLength = recipes.length
          const originalIds = recipes.map((r) => r.id)

          filterRecipes(recipes, { query })

          // Original array must be unchanged
          expect(recipes).toHaveLength(originalLength)
          expect(recipes.map((r) => r.id)).toEqual(originalIds)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: accessibility-first-recipe-reader, Property 4: Category filter correctness

/**
 * Property 4: Category filter correctness
 *
 * For any list of recipes and any category value ('breakfast', 'lunch', or 'dinner'),
 * the filtered result should contain only recipes whose `category` equals the selected
 * category, and no recipe with a different category should appear.
 *
 * Validates: Requirements 2.5
 */

describe('Property 4: Category filter correctness', () => {
  it('returns only recipes matching the selected category', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('breakfast', 'lunch', 'dinner') as fc.Arbitrary<'breakfast' | 'lunch' | 'dinner'>,
        (recipes, category) => {
          const result = filterRecipes(recipes, { category })

          // Every recipe in the result must have the selected category
          for (const recipe of result) {
            expect(recipe.category).toBe(category)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes no recipe with a different category', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('breakfast', 'lunch', 'dinner') as fc.Arbitrary<'breakfast' | 'lunch' | 'dinner'>,
        (recipes, category) => {
          const result = filterRecipes(recipes, { category })

          // No recipe in the result should have a different category
          const wrongCategory = result.filter((r) => r.category !== category)
          expect(wrongCategory).toHaveLength(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes every recipe from the original list that matches the category (completeness)', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('breakfast', 'lunch', 'dinner') as fc.Arbitrary<'breakfast' | 'lunch' | 'dinner'>,
        (recipes, category) => {
          const result = filterRecipes(recipes, { category })
          const resultIds = new Set(result.map((r) => r.id))

          // Every recipe in the original list that matches the category must appear in the result
          for (const recipe of recipes) {
            if (recipe.category === category) {
              expect(resultIds.has(recipe.id)).toBe(true)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('does not mutate the original recipes array', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('breakfast', 'lunch', 'dinner') as fc.Arbitrary<'breakfast' | 'lunch' | 'dinner'>,
        (recipes, category) => {
          const originalLength = recipes.length
          const originalIds = recipes.map((r) => r.id)

          filterRecipes(recipes, { category })

          expect(recipes).toHaveLength(originalLength)
          expect(recipes.map((r) => r.id)).toEqual(originalIds)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: accessibility-first-recipe-reader, Property 5: Difficulty filter correctness

/**
 * Property 5: Difficulty filter correctness
 *
 * For any list of recipes and any difficulty value ('easy', 'medium', or 'hard'),
 * the filtered result should contain only recipes whose `difficulty` equals the selected
 * difficulty.
 *
 * Validates: Requirements 2.7
 */

describe('Property 5: Difficulty filter correctness', () => {
  it('returns only recipes matching the selected difficulty', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('easy', 'medium', 'hard') as fc.Arbitrary<'easy' | 'medium' | 'hard'>,
        (recipes, difficulty) => {
          const result = filterRecipes(recipes, { difficulty })

          // Every recipe in the result must have the selected difficulty
          for (const recipe of result) {
            expect(recipe.difficulty).toBe(difficulty)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes no recipe with a different difficulty', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('easy', 'medium', 'hard') as fc.Arbitrary<'easy' | 'medium' | 'hard'>,
        (recipes, difficulty) => {
          const result = filterRecipes(recipes, { difficulty })

          // No recipe in the result should have a different difficulty
          const wrongDifficulty = result.filter((r) => r.difficulty !== difficulty)
          expect(wrongDifficulty).toHaveLength(0)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes every recipe from the original list that matches the difficulty (completeness)', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('easy', 'medium', 'hard') as fc.Arbitrary<'easy' | 'medium' | 'hard'>,
        (recipes, difficulty) => {
          const result = filterRecipes(recipes, { difficulty })
          const resultIds = new Set(result.map((r) => r.id))

          // Every recipe in the original list that matches the difficulty must appear in the result
          for (const recipe of recipes) {
            if (recipe.difficulty === difficulty) {
              expect(resultIds.has(recipe.id)).toBe(true)
            }
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('does not mutate the original recipes array', () => {
    fc.assert(
      fc.property(
        fc.array(recipeArbitrary),
        fc.constantFrom('easy', 'medium', 'hard') as fc.Arbitrary<'easy' | 'medium' | 'hard'>,
        (recipes, difficulty) => {
          const originalLength = recipes.length
          const originalIds = recipes.map((r) => r.id)

          filterRecipes(recipes, { difficulty })

          expect(recipes).toHaveLength(originalLength)
          expect(recipes.map((r) => r.id)).toEqual(originalIds)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: accessibility-first-recipe-reader, Property 6: Sort by cooking time preserves order invariant

/**
 * Property 6: Sort by cooking time preserves order invariant
 *
 * For any list of recipes sorted by cooking time ascending ('time-asc'), each recipe's
 * `cookingTime` should be less than or equal to the next recipe's `cookingTime` in the
 * sorted list.
 *
 * Validates: Requirements 2.9
 */

import { sortRecipes } from '@/lib/recipeFilters'

describe('Property 6: Sort by cooking time preserves order invariant', () => {
  it('sorted ascending: each cookingTime is ≤ the next cookingTime', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const sorted = sortRecipes(recipes, 'time-asc')

        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].cookingTime).toBeLessThanOrEqual(sorted[i + 1].cookingTime)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('sorted descending: each cookingTime is ≥ the next cookingTime', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const sorted = sortRecipes(recipes, 'time-desc')

        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].cookingTime).toBeGreaterThanOrEqual(sorted[i + 1].cookingTime)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('preserves all recipes: sorted result has the same length as the input', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const sorted = sortRecipes(recipes, 'time-asc')
        expect(sorted).toHaveLength(recipes.length)
      }),
      { numRuns: 100 }
    )
  })

  it('preserves all recipes: sorted result contains the same IDs as the input', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const sorted = sortRecipes(recipes, 'time-asc')
        const originalIds = new Set(recipes.map((r) => r.id))
        const sortedIds = new Set(sorted.map((r) => r.id))

        expect(sortedIds).toEqual(originalIds)
      }),
      { numRuns: 100 }
    )
  })

  it('does not mutate the original recipes array', () => {
    fc.assert(
      fc.property(fc.array(recipeArbitrary), (recipes) => {
        const originalOrder = recipes.map((r) => r.id)

        sortRecipes(recipes, 'time-asc')

        expect(recipes.map((r) => r.id)).toEqual(originalOrder)
      }),
      { numRuns: 100 }
    )
  })

  it('single-element list is trivially sorted', () => {
    fc.assert(
      fc.property(recipeArbitrary, (recipe) => {
        const sorted = sortRecipes([recipe], 'time-asc')
        expect(sorted).toHaveLength(1)
        expect(sorted[0].cookingTime).toBe(recipe.cookingTime)
      }),
      { numRuns: 100 }
    )
  })
})
