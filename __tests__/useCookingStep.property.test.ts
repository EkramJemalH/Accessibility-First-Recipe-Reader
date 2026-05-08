// Feature: accessibility-first-recipe-reader, Property 7: Cooking mode step counter stays in bounds

/**
 * Property 7: Cooking mode step counter stays in bounds
 *
 * For any recipe with N instructions and any sequence of next/previous navigation
 * actions, the current step index should always remain in the range [0, N-1].
 *
 * Validates: Requirements 4.2, 4.8
 */

import * as fc from 'fast-check'
import { renderHook, act } from '@testing-library/react'
import { useCookingStep } from '@/hooks/useCookingStep'

// ---------------------------------------------------------------------------
// Navigation action type
// ---------------------------------------------------------------------------

type NavAction = 'next' | 'prev'

// ---------------------------------------------------------------------------
// Pure model: mirrors the expected hook behaviour without React
// ---------------------------------------------------------------------------

function applyAction(step: number, totalSteps: number, action: NavAction): number {
  if (action === 'next') return Math.min(step + 1, totalSteps - 1)
  return Math.max(step - 1, 0)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Property 7: Cooking mode step counter stays in bounds', () => {
  it('currentStep always remains in [0, N-1] after any sequence of next/prev actions', () => {
    fc.assert(
      fc.property(
        // Non-empty instructions array (1–20 steps)
        fc.array(fc.string(), { minLength: 1, maxLength: 20 }),
        // Sequence of up to 50 navigation actions
        fc.array(fc.constantFrom<NavAction>('next', 'prev'), { maxLength: 50 }),
        (instructions, actions) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          // Track expected step with the pure model
          let modelStep = 0

          // Verify initial state
          expect(result.current.currentStep).toBe(0)

          // Execute each action and assert bounds after every step
          for (const action of actions) {
            act(() => {
              if (action === 'next') result.current.next()
              else result.current.prev()
            })

            modelStep = applyAction(modelStep, totalSteps, action)

            const realStep = result.current.currentStep

            // Core invariant: step must always be in [0, N-1]
            expect(realStep).toBeGreaterThanOrEqual(0)
            expect(realStep).toBeLessThanOrEqual(totalSteps - 1)

            // Real step must match the pure model
            expect(realStep).toBe(modelStep)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('next() clamps at totalSteps - 1 regardless of how many times it is called', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 100 }),
        (instructions, extraNextCalls) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          // Call next() far more times than there are steps
          const callCount = totalSteps + extraNextCalls
          for (let i = 0; i < callCount; i++) {
            act(() => {
              result.current.next()
            })
          }

          // Must be clamped at the last step
          expect(result.current.currentStep).toBe(totalSteps - 1)
          expect(result.current.isLast).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('prev() clamps at 0 regardless of how many times it is called', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 100 }),
        (instructions, extraPrevCalls) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          // Call prev() many times from the initial position (step 0)
          for (let i = 0; i < extraPrevCalls; i++) {
            act(() => {
              result.current.prev()
            })
          }

          // Must remain at step 0
          expect(result.current.currentStep).toBe(0)
          expect(result.current.isFirst).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('isFirst and isLast flags are consistent with currentStep after any navigation sequence', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 15 }),
        fc.array(fc.constantFrom<NavAction>('next', 'prev'), { maxLength: 30 }),
        (instructions, actions) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          for (const action of actions) {
            act(() => {
              if (action === 'next') result.current.next()
              else result.current.prev()
            })
          }

          const step = result.current.currentStep

          // isFirst must be true iff step === 0
          expect(result.current.isFirst).toBe(step === 0)
          // isLast must be true iff step === totalSteps - 1
          expect(result.current.isLast).toBe(step === totalSteps - 1)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('step advances by exactly 1 on next() when not at the last step', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 2, maxLength: 20 }),
        fc.integer({ min: 0 }),
        (instructions, seed) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          // Navigate to a non-last step using the seed
          const targetStep = seed % (totalSteps - 1) // guaranteed < totalSteps - 1
          for (let i = 0; i < targetStep; i++) {
            act(() => result.current.next())
          }

          const stepBefore = result.current.currentStep
          act(() => result.current.next())
          const stepAfter = result.current.currentStep

          // When not at the last step, next() must advance by exactly 1
          expect(stepAfter).toBe(stepBefore + 1)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('step decreases by exactly 1 on prev() when not at the first step', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 2, maxLength: 20 }),
        fc.integer({ min: 1 }),
        (instructions, seed) => {
          const totalSteps = instructions.length
          const { result } = renderHook(() => useCookingStep(totalSteps))

          // Navigate to a non-first step
          const targetStep = (seed % (totalSteps - 1)) + 1 // guaranteed in [1, totalSteps-1]
          for (let i = 0; i < targetStep; i++) {
            act(() => result.current.next())
          }

          const stepBefore = result.current.currentStep
          act(() => result.current.prev())
          const stepAfter = result.current.currentStep

          // When not at the first step, prev() must decrease by exactly 1
          expect(stepAfter).toBe(stepBefore - 1)
        }
      ),
      { numRuns: 100 }
    )
  })
})
