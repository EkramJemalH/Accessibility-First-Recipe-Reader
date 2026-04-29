// import { notFound } from 'next/navigation'
// import { recipes } from '@/lib/recipes'
// import { RecipeDetail } from '../../../components/recipe-detail'

// interface RecipePageProps {
//   params: Promise<{ id: string }>
// }

// export default async function RecipePage({ params }: RecipePageProps) {
//   const { id } = await params
//   const recipe = recipes.find((r) => r.id === id)

//   if (!recipe) {
//     notFound()
//   }

//   return <RecipeDetail recipe={recipe} />
// }



// // app/recipe/[id]/page.tsx
// import { notFound } from 'next/navigation';
// import { recipes } from '@/lib/recipes';
// import { RecipeDetail } from '../../../components/recipe-detail';

// interface RecipePageProps {
//   params: Promise<{ id: string }>
// }

// export default async function RecipePage({ params }: RecipePageProps) {
//   const { id } = await params;
//   const recipe = recipes.find((r) => r.id === id);

//   if (!recipe) {
//     notFound();
//   }

//   return <RecipeDetail recipe={recipe} />;
// }





// app/recipe/[id]/page.tsx
import { notFound } from 'next/navigation';
import { recipes } from '@/lib/recipes';
import { RecipeDetail } from '@/components/recipe-detail';

interface Props {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = recipes.find((r) => r.id === id);
  
  if (!recipe) return notFound();
  
  return <RecipeDetail recipe={recipe} />;
}