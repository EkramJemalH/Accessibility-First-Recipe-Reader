import { notFound } from 'next/navigation'
import { recipes } from '@/lib/recipes'
import { RecipeDetail } from '@/components/recipe-detail'

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
