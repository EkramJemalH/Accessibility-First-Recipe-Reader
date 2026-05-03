/**
 * Pure utility for clamping font scale values in Reading Mode.
 *
 * Requirements: 5.4, 5.5
 */

const MIN_FONT_SCALE = 0.8
const MAX_FONT_SCALE = 1.5

/**
 * Applies a delta to the current font scale and clamps the result
 * within the allowed range [0.8, 1.5].
 *
 * @param scale  - Current font scale value (should be in [0.8, 1.5])
 * @param delta  - Amount to add (positive to increase, negative to decrease)
 * @returns      - New clamped font scale value
 *
 * @example
 * clampFontScale(1.0, +0.1)  // → 1.1
 * clampFontScale(1.5, +0.1)  // → 1.5  (clamped at max)
 * clampFontScale(0.8, -0.1)  // → 0.8  (clamped at min)
 */
export function clampFontScale(scale: number, delta: number): number {
  const next = scale + delta
  if (delta > 0) {
    return Math.min(next, MAX_FONT_SCALE)
  }
  return Math.max(next, MIN_FONT_SCALE)
}
