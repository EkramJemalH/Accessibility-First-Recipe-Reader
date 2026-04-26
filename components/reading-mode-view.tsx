'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { Recipe } from '@/lib/recipes'
import { Button } from '@/components/ui/button'

interface ReadingModeViewProps {
  recipe: Recipe
  onExit: () => void
}

export function ReadingModeView({ recipe, onExit }: ReadingModeViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Reading Mode</h1>
          <Button
            variant="ghost"
            onClick={onExit}
            aria-label="Exit reading mode"
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-2xl mx-auto px-4 prose prose-lg dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-4">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{recipe.description}</p>

          {/* Ingredients */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Ingredients</h2>
            <ul className="space-y-3 mb-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-foreground flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>
                    <strong>{ingredient.amount}</strong> {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Instructions</h2>
            <ol className="space-y-4 mb-6 list-decimal list-inside">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-foreground leading-relaxed">
                  {instruction}
                </li>
              ))}
            </ol>
          </section>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Tips</h2>
              <div className="space-y-3 p-6 rounded-lg bg-card border border-border">
                {recipe.tips.map((tip, index) => (
                  <p key={index} className="text-foreground leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Action */}
          <div className="flex gap-4 pt-8 border-t border-border">
            <Button
              onClick={onExit}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Back to Recipe
            </Button>
            <Link href="/" className="inline-flex items-center justify-center">
              <Button
                variant="outline"
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse More Recipes
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
