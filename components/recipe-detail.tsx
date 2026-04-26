'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, ChefHat, Eye, Flame } from 'lucide-react'
import { Recipe } from '@/lib/recipes'
import { Button } from '@/components/ui/button'
import { ReadingModeView } from '../components/reading-mode-view'
import { CookingModeView } from '../components/cooking-mode-view'

interface RecipeDetailProps {
  recipe: Recipe
}

const difficultyLabels: Record<Recipe['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const difficultyColors: Record<Recipe['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [viewMode, setViewMode] = useState<'normal' | 'reading' | 'cooking'>('normal')

  if (viewMode === 'reading') {
    return <ReadingModeView recipe={recipe} onExit={() => setViewMode('normal')} />
  }

  if (viewMode === 'cooking') {
    return <CookingModeView recipe={recipe} onExit={() => setViewMode('normal')} />
  }

  return (
    <article className="bg-background min-h-screen">
      {/* Header with Navigation */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span>Back to recipes</span>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode('reading')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                Reading Mode
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode('cooking')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Flame className="w-4 h-4 mr-2" aria-hidden="true" />
                Cooking Mode
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Title and Meta */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Cooking Time</div>
                <div className="font-semibold">{recipe.cookingTime} minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" aria-hidden="true" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-accent" aria-hidden="true" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Difficulty</div>
                <div className={`font-semibold px-3 py-1 rounded-full text-sm ${difficultyColors[recipe.difficulty]}`}>
                  {difficultyLabels[recipe.difficulty]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Ingredients */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3 text-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      aria-label={`Use ${ingredient.name}`}
                    />
                    <span>
                      <strong>{ingredient.amount}</strong> {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4 text-foreground">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold">
                      {index + 1}
                    </span>
                    <span className="pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Tips */}
            {recipe.tips && recipe.tips.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Chef&apos;s Tips</h2>
                <div className="space-y-3 p-6 rounded-lg bg-card border border-border">
                  {recipe.tips.map((tip, index) => (
                    <p key={index} className="text-foreground flex gap-3">
                      <span className="text-accent font-bold flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Summary */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-6 p-6 rounded-lg bg-card border border-border">
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-2">YIELD</h3>
                <p className="text-2xl font-bold text-foreground">{recipe.servings}</p>
                <p className="text-sm text-muted-foreground">servings</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">PREP TIME</h3>
                <p className="text-2xl font-bold text-foreground">{Math.ceil(recipe.cookingTime * 0.4)}</p>
                <p className="text-sm text-muted-foreground">minutes</p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">COOK TIME</h3>
                <p className="text-2xl font-bold text-foreground">{Math.floor(recipe.cookingTime * 0.6)}</p>
                <p className="text-sm text-muted-foreground">minutes</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
