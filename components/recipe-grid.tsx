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
          {title && (
            <h2 className="mb-8 text-2xl font-bold text-foreground">
              {title}
            </h2>
          )}

          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No recipes found. Try adjusting your search.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="mb-8 text-2xl font-bold text-foreground">
            {title}
          </h2>
        )}

        <div className="grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div
            className="flex -ml-6"
            style={{ touchAction: 'pan-y pinch-zoom' }}
          >
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="h-full py-1">
                  <RecipeCard
                    recipe={recipe}
                    priority={index < 2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {snapCount > 1 && (
          <div
            className="mt-6 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Carousel pagination"
          >
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === selectedSnap}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`
                  cursor-pointer rounded-full transition-all duration-300 ease-out
                  ${
                    i === selectedSnap
                      ? 'h-2 w-6 bg-accent shadow-sm'
                      : 'h-2 w-2 bg-border hover:bg-muted-foreground/40'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
