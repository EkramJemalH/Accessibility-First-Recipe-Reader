'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Recipe } from '@/lib/recipes'
import { Button } from '@/components/ui/button'

interface CookingModeViewProps {
  recipe: Recipe
  onExit: () => void
}

export function CookingModeView({ recipe, onExit }: CookingModeViewProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Announce step changes to screen readers
  useEffect(() => {
    const announcement = `Step ${currentStep + 1} of ${recipe.instructions.length}: ${recipe.instructions[currentStep]}`
    const ariaLive = document.createElement('div')
    ariaLive.setAttribute('role', 'status')
    ariaLive.setAttribute('aria-live', 'polite')
    ariaLive.setAttribute('aria-atomic', 'true')
    ariaLive.textContent = announcement
    ariaLive.className = 'sr-only'
    document.body.appendChild(ariaLive)
    return () => ariaLive.remove()
  }, [currentStep, recipe.instructions])

  const handleNext = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrev()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      role="region"
      aria-label="Cooking mode"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{recipe.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of {recipe.instructions.length}
          </p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={onExit}
          aria-label="Exit cooking mode"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Step Number */}
        <div className="text-6xl font-bold text-accent mb-8">
          {currentStep + 1}
        </div>

        {/* Instruction */}
        <div className="text-center max-w-3xl mb-12">
          <p className="text-3xl font-bold text-foreground leading-relaxed">
            {recipe.instructions[currentStep]}
          </p>
        </div>

        {/* Ingredients for current step (optional hint) */}
        <div className="text-center text-muted-foreground mb-12">
          <p className="text-sm">Use arrow keys or buttons to navigate</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 p-6 border-t border-border bg-card">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          size="lg"
          className="h-14 w-14 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentStep + 1}
              aria-valuemin={1}
              aria-valuemax={recipe.instructions.length}
            />
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === recipe.instructions.length - 1}
          size="lg"
          className="h-14 w-14 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </Button>
      </div>

      {/* Completion Message */}
      {currentStep === recipe.instructions.length - 1 && (
        <div className="border-t border-border bg-accent text-accent-foreground text-center py-4 px-6">
          <p className="font-semibold">Great! You&apos;ve completed all steps. Enjoy your meal!</p>
        </div>
      )}
    </div>
  )
}
