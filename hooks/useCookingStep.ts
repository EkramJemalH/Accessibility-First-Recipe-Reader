'use client'

import { useState, useCallback } from 'react'

/**
 * A pure step-counter hook for cooking mode navigation.
 *
 * @param totalSteps  The total number of steps (instructions) in the recipe.
 * @returns           An object with:
 *                    - `currentStep` — 0-indexed current step index
 *                    - `next()`      — advances to the next step, clamped at totalSteps - 1
 *                    - `prev()`      — goes back to the previous step, clamped at 0
 *                    - `isFirst`     — true when currentStep === 0
 *                    - `isLast`      — true when currentStep === totalSteps - 1
 */
export interface UseCookingStepReturn {
  currentStep: number
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean
}

export function useCookingStep(totalSteps: number): UseCookingStepReturn {
  const [currentStep, setCurrentStep] = useState(0)

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  return {
    currentStep,
    next,
    prev,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
  }
}
