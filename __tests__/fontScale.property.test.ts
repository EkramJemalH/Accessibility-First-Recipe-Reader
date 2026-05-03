// Feature: accessibility-first-recipe-reader, Property 8: Reading mode font scale stays in bounds

import * as fc from 'fast-check'
import { clampFontScale } from '../lib/fontScale'

/**
 * Property 8: Reading mode font scale stays in bounds
 * Validates: Requirements 5.4, 5.5
 *
 * For any current font scale value in [0.8, 1.5]:
 * - Applying an increment (+0.1) should produce min(scale + 0.1, 1.5)
 * - Applying a decrement (-0.1) should produce max(scale - 0.1, 0.8)
 */
describe('Property 8: Reading mode font scale stays in bounds', () => {
  it('increment produces min(scale + 0.1, 1.5) for any scale in [0.8, 1.5]', () => {
    fc.assert(
      fc.property(fc.float({ min: Math.fround(0.8), max: Math.fround(1.5), noNaN: true }), (scale) => {
        const result = clampFontScale(scale, 0.1)
        const expected = Math.min(scale + 0.1, 1.5)
        // Use tolerance for floating point comparison
        expect(result).toBeCloseTo(expected, 10)
        // Also assert the result stays within bounds
        expect(result).toBeGreaterThanOrEqual(0.8)
        expect(result).toBeLessThanOrEqual(1.5)
      }),
      { numRuns: 100 }
    )
  })

  it('decrement produces max(scale - 0.1, 0.8) for any scale in [0.8, 1.5]', () => {
    fc.assert(
      fc.property(fc.float({ min: Math.fround(0.8), max: Math.fround(1.5), noNaN: true }), (scale) => {
        const result = clampFontScale(scale, -0.1)
        const expected = Math.max(scale - 0.1, 0.8)
        // Use tolerance for floating point comparison
        expect(result).toBeCloseTo(expected, 10)
        // Also assert the result stays within bounds
        expect(result).toBeGreaterThanOrEqual(0.8)
        expect(result).toBeLessThanOrEqual(1.5)
      }),
      { numRuns: 100 }
    )
  })
})
