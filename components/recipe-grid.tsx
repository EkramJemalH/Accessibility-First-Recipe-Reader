import { Recipe } from '@/lib/recipes'
import { RecipeCard } from '@/components/recipe-card'

interface RecipeGridProps {
  recipes: Recipe[]
  title?: string
}

export function RecipeGrid({ recipes, title }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-2xl font-bold mb-8 text-foreground">{title}</h2>}
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No recipes found. Try adjusting your search.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-2xl font-bold mb-8 text-foreground">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  )
}
