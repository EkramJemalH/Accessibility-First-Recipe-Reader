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

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6" style={{ touchAction: 'pan-y pinch-zoom' }}>
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="flex-[0_0_100%] min-w-0 pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="h-full py-1">
                  {/* The first two slides are visible above the fold on initial load.
                      Pass priority so Next.js sets loading="eager" and adds a preload
                      link, eliminating the LCP warning for those images. */}
                  <RecipeCard recipe={recipe} priority={index < 2} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators - Compact and closer to the cards */}
        {snapCount > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-6" role="tablist" aria-label="Carousel pagination">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === selectedSnap}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`
                  rounded-full transition-all duration-300 ease-out cursor-pointer
                  ${i === selectedSnap
                    ? 'w-6 h-2 bg-accent shadow-sm'
                    : 'w-2 h-2 bg-border hover:bg-muted-foreground/40'
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
