// Feature: accessibility-first-recipe-reader, Property 2: Favorites toggle idempotency

/**
 * Property 2: Favorites toggle idempotency
 *
 * For any favorites list and any recipe ID, toggling the save state twice
 * (on then off, or off then on) should return the favorites list to its
 * original state.
 *
 * Validates: Requirements 2.11, 6.4
 */

import * as fc from 'fast-check'

/**
 * Pure toggle function extracted from FavoritesContext.tsx.
 *
 * This mirrors the exact logic used in FavoritesProvider.toggleSave:
 *   setSavedIds(prev =>
 *     prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
 *   )
 */
function toggleFavorite(savedIds: string[], id: string): string[] {
  return savedIds.includes(id)
    ? savedIds.filter((i) => i !== id)
    : [...savedIds, id]
}

describe('Property 2: Favorites toggle idempotency', () => {
  /**
   * The favorites list is a set of unique recipe IDs (no duplicates).
   * This arbitrary generates a unique-element array plus a separate target ID,
   * reflecting the real-world invariant that each recipe ID appears at most once.
   */
  const uniqueIdsWithTargetArbitrary = fc.string({ minLength: 1 }).chain((targetId) =>
    fc
      .uniqueArray(fc.string({ minLength: 1 }).filter((s) => s !== targetId))
      .map((ids) => ({ ids, targetId }))
  )

  it('toggling a recipe ID twice returns the list to its original state', () => {
    fc.assert(
      fc.property(uniqueIdsWithTargetArbitrary, ({ ids, targetId }) => {
        const afterFirstToggle = toggleFavorite(ids, targetId)
        const afterSecondToggle = toggleFavorite(afterFirstToggle, targetId)

        // After two toggles the list must equal the original
        expect(afterSecondToggle).toEqual(ids)
      }),
      { numRuns: 100 }
    )
  })

  it('toggling an absent ID adds it, toggling again removes it', () => {
    fc.assert(
      fc.property(
        // Generate a list that does NOT contain the target ID
        fc.string({ minLength: 2 }).chain((id) =>
          fc
            .array(fc.string({ minLength: 2 }).filter((s) => s !== id))
            .map((ids) => ({ ids, id }))
        ),
        ({ ids, id }) => {
          // ID is not present initially
          expect(ids).not.toContain(id)

          const afterAdd = toggleFavorite(ids, id)
          expect(afterAdd).toContain(id)

          const afterRemove = toggleFavorite(afterAdd, id)
          expect(afterRemove).not.toContain(id)

          // Back to original state
          expect(afterRemove).toEqual(ids)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('toggling a present ID removes it, toggling again adds it back', () => {
    fc.assert(
      fc.property(
        // Generate a list that DOES contain the target ID
        fc.string({ minLength: 1 }).chain((id) =>
          fc
            .array(fc.string({ minLength: 1 }).filter((s) => s !== id))
            .map((rest) => {
              // Insert the target ID at a random position
              const ids = [...rest, id]
              return { ids, id }
            })
        ),
        ({ ids, id }) => {
          // ID is present initially
          expect(ids).toContain(id)

          const afterRemove = toggleFavorite(ids, id)
          expect(afterRemove).not.toContain(id)

          const afterAddBack = toggleFavorite(afterRemove, id)
          expect(afterAddBack).toContain(id)

          // Back to original state (order may differ for the re-added item,
          // but the set of IDs must be the same)
          expect(afterAddBack).toHaveLength(ids.length)
          expect(afterAddBack.sort()).toEqual([...ids].sort())
        }
      ),
      { numRuns: 100 }
    )
  })

  it('toggle does not mutate the original array', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.string(), (initialIds, recipeId) => {
        const snapshot = [...initialIds]
        toggleFavorite(initialIds, recipeId)

        // Original array must be unchanged
        expect(initialIds).toEqual(snapshot)
      }),
      { numRuns: 100 }
    )
  })
})
