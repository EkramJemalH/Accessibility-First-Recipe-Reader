


// // components/recipe-detail.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { ArrowLeft, Clock, Users, ChefHat, Eye, Flame, Check, Printer, Share2, Heart, Bookmark, Star } from 'lucide-react';
// import { Recipe } from '@/lib/recipes';

// interface RecipeDetailProps {
//   recipe: Recipe;
// }

// export function RecipeDetail({ recipe }: RecipeDetailProps) {
//   const [viewMode, setViewMode] = useState<'normal' | 'reading' | 'cooking'>('normal');
//   const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
//   const [liked, setLiked] = useState(false);
//   const [saved, setSaved] = useState(false);

//   useEffect(() => {
//     const savedLikes = localStorage.getItem('recipeLikes');
//     if (savedLikes) setLiked(JSON.parse(savedLikes).includes(recipe.id));
//   }, [recipe.id]);

//   const toggleIngredient = (index: number) => {
//     setCheckedIngredients(prev =>
//       prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
//     );
//   };

//   const toggleLike = () => {
//     setLiked(!liked);
//     // Save to localStorage
//     const saved = localStorage.getItem('recipeLikes');
//     const likes = saved ? JSON.parse(saved) : [];
//     if (!liked) {
//       localStorage.setItem('recipeLikes', JSON.stringify([...likes, recipe.id]));
//     } else {
//       localStorage.setItem('recipeLikes', JSON.stringify(likes.filter((id: string) => id !== recipe.id)));
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: recipe.title,
//         text: recipe.description,
//         url: window.location.href,
//       });
//     } else {
//       alert('Copy the URL to share: ' + window.location.href);
//     }
//   };

//   if (viewMode === 'reading') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
//           <button onClick={() => setViewMode('normal')} className="text-amber-600 hover:text-amber-700">
//             ← Back to Recipe
//           </button>
//         </div>
//         <div className="max-w-3xl mx-auto p-8">
//           <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
//           <p className="text-gray-600 mb-8">{recipe.description}</p>
//           <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
//           <ul className="space-y-2 mb-8">
//             {recipe.ingredients.map((ing, i) => (
//               <li key={i}>• {ing.amount} {ing.name}</li>
//             ))}
//           </ul>
//           <h2 className="text-2xl font-bold mb-4">Instructions</h2>
//           <ol className="space-y-4">
//             {recipe.instructions.map((inst, i) => (
//               <li key={i}>{i+1}. {inst}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     );
//   }

//   if (viewMode === 'cooking') {
//     const [step, setStep] = useState(0);
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
//         <div className="sticky top-0 bg-white border-b border-amber-200 p-4">
//           <button onClick={() => setViewMode('normal')} className="text-amber-600">← Exit Cooking Mode</button>
//         </div>
//         <div className="container mx-auto px-4 py-8 max-w-2xl">
//           <div className="bg-white rounded-2xl p-8 shadow-xl">
//             <h2 className="text-2xl font-bold mb-4">Step {step + 1} of {recipe.instructions.length}</h2>
//             <p className="text-xl mb-8">{recipe.instructions[step]}</p>
//             <div className="flex justify-between">
//               <button 
//                 onClick={() => setStep(Math.max(0, step-1))}
//                 disabled={step === 0}
//                 className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button 
//                 onClick={() => setStep(Math.min(recipe.instructions.length-1, step+1))}
//                 disabled={step === recipe.instructions.length-1}
//                 className="px-6 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <article className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
//       {/* Header */}
//       <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <Link href="/#recipes" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900">
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to recipes</span>
//             </Link>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setViewMode('reading')}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
//               >
//                 <Eye className="w-4 h-4" />
//                 Reading Mode
//               </button>
//               <button
//                 onClick={() => setViewMode('cooking')}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
//               >
//                 <Flame className="w-4 h-4" />
//                 Cooking Mode
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="w-full h-96 overflow-hidden relative">
//         <img
//           src={recipe.image}
//           alt={recipe.title}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//         <div className="absolute bottom-6 left-6 flex gap-2">
//           <button onClick={toggleLike} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Heart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-700'} size={24} />
//           </button>
//           <button onClick={handleShare} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Share2 size={24} className="text-gray-700" />
//           </button>
//           <button onClick={handlePrint} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Printer size={24} className="text-gray-700" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           {/* Title */}
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
//             <p className="text-lg text-gray-600">{recipe.description}</p>
//           </div>

//           {/* Meta Info */}
//           <div className="flex flex-wrap gap-6 mb-12 p-6 bg-white rounded-2xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <Clock className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Time</div>
//                 <div className="font-semibold">{recipe.cookingTime} min</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Users className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Servings</div>
//                 <div className="font-semibold">{recipe.servings}</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <ChefHat className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Difficulty</div>
//                 <div className="font-semibold capitalize">{recipe.difficulty}</div>
//               </div>
//             </div>
//           </div>

//           {/* Two Column Layout */}
//           <div className="grid md:grid-cols-2 gap-8">
//             {/* Ingredients */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
//               <ul className="space-y-3">
//                 {recipe.ingredients.map((ingredient, index) => (
//                   <li key={index} className="flex items-start gap-3">
//                     <input
//                       type="checkbox"
//                       checked={checkedIngredients.includes(index)}
//                       onChange={() => toggleIngredient(index)}
//                       className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
//                     />
//                     <span className={`text-gray-700 ${checkedIngredients.includes(index) ? 'line-through opacity-60' : ''}`}>
//                       <span className="font-semibold">{ingredient.amount}</span> {ingredient.name}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//               {checkedIngredients.length === recipe.ingredients.length && recipe.ingredients.length > 0 && (
//                 <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
//                   <Check size={16} /> All ingredients checked!
//                 </div>
//               )}
//             </div>

//             {/* Nutrition */}
//             {recipe.nutrition && (
//               <div className="bg-white rounded-2xl p-6 shadow-sm">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Nutrition Facts</h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between py-2 border-b">
//                     <span className="text-gray-600">Calories</span>
//                     <span className="font-semibold">{recipe.nutrition.calories}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b">
//                     <span className="text-gray-600">Protein</span>
//                     <span className="font-semibold">{recipe.nutrition.protein}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b">
//                     <span className="text-gray-600">Carbs</span>
//                     <span className="font-semibold">{recipe.nutrition.carbs}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Fat</span>
//                     <span className="font-semibold">{recipe.nutrition.fat}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Instructions */}
//           <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
//             <ol className="space-y-6">
//               {recipe.instructions.map((instruction, index) => (
//                 <li key={index} className="flex gap-4">
//                   <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-bold">
//                     {index + 1}
//                   </span>
//                   <span className="text-gray-700 pt-1">{instruction}</span>
//                 </li>
//               ))}
//             </ol>
//           </div>

//           {/* Tips */}
//           {recipe.tips && recipe.tips.length > 0 && (
//             <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Chef's Tips</h2>
//               <ul className="space-y-2">
//                 {recipe.tips.map((tip, index) => (
//                   <li key={index} className="text-gray-700 flex gap-2">
//                     <span className="text-amber-600">•</span>
//                     {tip}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Bottom Actions */}
//           <div className="mt-8 flex gap-4 justify-center">
//             <button
//               onClick={() => setViewMode('reading')}
//               className="px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition"
//             >
//               📖 Reading Mode
//             </button>
//             <button
//               onClick={() => setViewMode('cooking')}
//               className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
//             >
//               👨‍🍳 Start Cooking Mode
//             </button>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }



// // components/recipe-detail.tsx - Complete updated version
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { ArrowLeft, Clock, Users, ChefHat, Eye, Flame, Check, Printer, Share2, Heart, Bookmark } from 'lucide-react';
// import { Recipe } from '@/lib/recipes';
// import { CookingModeView } from '../components/cooking-mode-view';

// interface RecipeDetailProps {
//   recipe: Recipe;
// }

// export function RecipeDetail({ recipe }: RecipeDetailProps) {
//   const [viewMode, setViewMode] = useState<'normal' | 'reading' | 'cooking'>('normal');
//   const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
//   const [liked, setLiked] = useState(false);

//   useEffect(() => {
//     const savedLikes = localStorage.getItem('recipeLikes');
//     if (savedLikes) setLiked(JSON.parse(savedLikes).includes(recipe.id));
//   }, [recipe.id]);

//   const toggleIngredient = (index: number) => {
//     setCheckedIngredients(prev =>
//       prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
//     );
//   };

//   const toggleLike = () => {
//     setLiked(!liked);
//     const saved = localStorage.getItem('recipeLikes');
//     const likes = saved ? JSON.parse(saved) : [];
//     if (!liked) {
//       localStorage.setItem('recipeLikes', JSON.stringify([...likes, recipe.id]));
//     } else {
//       localStorage.setItem('recipeLikes', JSON.stringify(likes.filter((id: string) => id !== recipe.id)));
//     }
//   };

//   const handlePrint = () => window.print();
  
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: recipe.title,
//         text: recipe.description,
//         url: window.location.href,
//       });
//     } else {
//       alert('Copy the URL to share: ' + window.location.href);
//     }
//   };

//   // Reading Mode
//   if (viewMode === 'reading') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
//           <button onClick={() => setViewMode('normal')} className="text-amber-600 hover:text-amber-700">
//             ← Back to Recipe
//           </button>
//         </div>
//         <div className="max-w-3xl mx-auto p-8">
//           <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
//           <p className="text-gray-600 mb-8">{recipe.description}</p>
//           <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
//           <ul className="space-y-2 mb-8">
//             {recipe.ingredients.map((ing, i) => (
//               <li key={i}>• {ing.amount} {ing.name}</li>
//             ))}
//           </ul>
//           <h2 className="text-2xl font-bold mb-4">Instructions</h2>
//           <ol className="space-y-4">
//             {recipe.instructions.map((inst, i) => (
//               <li key={i}>{i+1}. {inst}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     );
//   }

//   // Cooking Mode - Now using the dedicated component
//   if (viewMode === 'cooking') {
//     return <CookingModeView recipe={recipe} onExit={() => setViewMode('normal')} />;
//   }

//   // Normal View
//   return (
//     <article className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
//       {/* Header */}
//       <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <Link href="/#recipes" className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900">
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to recipes</span>
//             </Link>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setViewMode('reading')}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
//               >
//                 <Eye className="w-4 h-4" />
//                 Reading Mode
//               </button>
//               <button
//                 onClick={() => setViewMode('cooking')}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
//               >
//                 <Flame className="w-4 h-4" />
//                 Cooking Mode
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hero Image */}
//       <div className="w-full h-96 overflow-hidden relative">
//         <img
//           src={recipe.image}
//           alt={recipe.title}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//         <div className="absolute bottom-6 left-6 flex gap-2">
//           <button onClick={toggleLike} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Heart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-700'} size={24} />
//           </button>
//           <button onClick={handleShare} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Share2 size={24} className="text-gray-700" />
//           </button>
//           <button onClick={handlePrint} className="bg-white/90 backdrop-blur p-2 rounded-full hover:scale-110 transition">
//             <Printer size={24} className="text-gray-700" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
//             <p className="text-lg text-gray-600">{recipe.description}</p>
//           </div>

//           <div className="flex flex-wrap gap-6 mb-12 p-6 bg-white rounded-2xl shadow-sm">
//             <div className="flex items-center gap-3">
//               <Clock className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Time</div>
//                 <div className="font-semibold">{recipe.cookingTime} min</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Users className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Servings</div>
//                 <div className="font-semibold">{recipe.servings}</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <ChefHat className="w-6 h-6 text-amber-600" />
//               <div>
//                 <div className="text-sm text-gray-500">Difficulty</div>
//                 <div className="font-semibold capitalize">{recipe.difficulty}</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
//             <ul className="space-y-3">
//               {recipe.ingredients.map((ingredient, index) => (
//                 <li key={index} className="flex items-start gap-3">
//                   <input
//                     type="checkbox"
//                     checked={checkedIngredients.includes(index)}
//                     onChange={() => toggleIngredient(index)}
//                     className="mt-1 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
//                   />
//                   <span className={`text-gray-700 ${checkedIngredients.includes(index) ? 'line-through opacity-60' : ''}`}>
//                     <span className="font-semibold">{ingredient.amount}</span> {ingredient.name}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
//             <ol className="space-y-6">
//               {recipe.instructions.map((instruction, index) => (
//                 <li key={index} className="flex gap-4">
//                   <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-bold">
//                     {index + 1}
//                   </span>
//                   <span className="text-gray-700 pt-1">{instruction}</span>
//                 </li>
//               ))}
//             </ol>
//           </div>

//           {recipe.tips && recipe.tips.length > 0 && (
//             <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Chef's Tips</h2>
//               <ul className="space-y-2">
//                 {recipe.tips.map((tip, index) => (
//                   <li key={index} className="text-gray-700 flex gap-2">
//                     <span className="text-amber-600">•</span>
//                     {tip}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="mt-8 flex gap-4 justify-center">
//             <button
//               onClick={() => setViewMode('reading')}
//               className="px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition"
//             >
//                Reading Mode
//             </button>
//             <button
//               onClick={() => setViewMode('cooking')}
//               className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
//             >
//                Start Cooking Mode
//             </button>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }






// components/recipe-detail.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, ChefHat, Eye, Flame, Check } from 'lucide-react';
import { Recipe } from '@/lib/recipes';

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [viewMode, setViewMode] = useState<'normal' | 'reading' | 'cooking'>('normal');
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  if (viewMode === 'reading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white p-4 border-b">
          <button onClick={() => setViewMode('normal')} className="text-amber-600">← Back</button>
        </div>
        <div className="max-w-2xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-600 mb-6">{recipe.description}</p>
          <h2 className="text-xl font-bold mb-3">Ingredients</h2>
          <ul className="mb-6 space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>• {ing.amount} {ing.name}</li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mb-3">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((inst, i) => (
              <li key={i}>{i+1}. {inst}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (viewMode === 'cooking') {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="sticky top-0 bg-white p-4 border-b">
          <button onClick={() => setViewMode('normal')} className="text-amber-600">← Exit Cooking Mode</button>
        </div>
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Step {currentStep + 1} of {recipe.instructions.length}</h2>
            <p className="text-xl mb-8">{recipe.instructions[currentStep]}</p>
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep-1))} className="px-6 py-2 bg-gray-200 rounded-lg">Previous</button>
              <button onClick={() => setCurrentStep(Math.min(recipe.instructions.length-1, currentStep+1))} className="px-6 py-2 bg-amber-600 text-white rounded-lg">Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal View
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-amber-600 mb-4">
        <ArrowLeft size={18} /> Back to recipes
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>

          <div className="flex gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2"><Clock size={18} />{recipe.cookingTime} min</div>
            <div className="flex items-center gap-2"><Users size={18} />{recipe.servings}</div>
            <div className="flex items-center gap-2"><ChefHat size={18} />{recipe.difficulty}</div>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={() => setViewMode('reading')} className="flex items-center gap-2 px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50">
              <Eye size={18} /> Reading Mode
            </button>
            <button onClick={() => setViewMode('cooking')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              <Flame size={18} /> Cooking Mode
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Ingredients</h2>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input type="checkbox" onChange={() => setCheckedIngredients(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} />
                <span className={checkedIngredients.includes(i) ? 'line-through text-gray-400' : ''}>{ing.amount} {ing.name}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Instructions</h2>
            {recipe.instructions.map((inst, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <span className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm">{i+1}</span>
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}