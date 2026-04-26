'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Recipe } from '@/lib/recipes'
import { RecipeCard } from '@/components/recipe-card'

interface RecipeGridProps {
  recipes: Recipe[]
  title?: string
}

export function RecipeGrid({ recipes, title }: RecipeGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    loop: true,
  })

  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedSnap(emblaApi.selectedScrollSnap())
    setSnapCount(emblaApi.scrollSnapList().length)
  }, [emblaApi])

  // Autoplay Logic
  useEffect(() => {
    if (!emblaApi || isPaused) return

    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000) // 4 seconds

    return () => clearInterval(intervalId)
  }, [emblaApi, isPaused])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  // Re-initialize when recipes change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [emblaApi, recipes])

  if (recipes.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          {title && <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>}
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-muted-foreground text-lg">No recipes found. Try adjusting your filters.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="py-6 sm:py-8 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header with title and navigation arrows */}
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>}
          {recipes.length > 3 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous recipes"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-secondary hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next recipes"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-secondary hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6" style={{ touchAction: 'pan-y pinch-zoom' }}>
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex-[0_0_100%] min-w-0 pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <div className="h-full py-1">
                  <RecipeCard recipe={recipe} />
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
