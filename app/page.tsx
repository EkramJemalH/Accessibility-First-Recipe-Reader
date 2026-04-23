import { recipes } from '@/lib/recipes'
import { RecipeGrid } from '@/components/recipe-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative gradient — visible only in light mode */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-accent/[0.04] dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-6 tracking-wide">
            🍳 Your Culinary Companion
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Welcome to Recipe Reader
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover delicious recipes with an accessible design. Customize text size, spacing, and contrast to suit your preferences.
          </p>
        </div>
      </section>

      {/* Featured Recipes */}
      <RecipeGrid recipes={recipes} title="Featured Recipes" />
    </div>
  )
}
