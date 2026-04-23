import { recipes } from '@/lib/recipes'
import { RecipeGrid } from '@/components/recipe-grid'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.toLowerCase() || ''

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query) ||
    recipe.description.toLowerCase().includes(query)
  )

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Results
          </h1>
          <p className="text-muted-foreground">
            {query && (
              <>
                Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-foreground">"{query}"</span>
              </>
            )}
          </p>
        </div>
      </section>

      <RecipeGrid recipes={filteredRecipes} />
    </div>
  )
}
