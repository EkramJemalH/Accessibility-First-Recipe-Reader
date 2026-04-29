import Link from 'next/link'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Recipe } from '@/lib/recipes'

interface RecipeCardProps {
  recipe: Recipe
}

const difficultyColors: Record<Recipe['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const difficultyLabels: Record<Recipe['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="group flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted aspect-video">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 group-focus-visible:outline-none">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
            <ChefHat className="w-3 h-3" aria-hidden="true" />
            <span className="font-medium">{difficultyLabels[recipe.difficulty]}</span>
          </div>
        </div>

        {/* View Recipe Button */}
        <Link
          href={`/recipe/${recipe.id}`}
          className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95"
        >
          View Recipe
        </Link>
      </div>
    </article>
  )
}
