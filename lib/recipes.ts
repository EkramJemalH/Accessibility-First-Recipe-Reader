// // lib/recipes.ts
// export interface Recipe {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   cookingTime: number;
//   servings: number;
//   difficulty: 'easy' | 'medium' | 'hard';
//   ingredients: {
//     amount: string;
//     name: string;
//   }[];
//   instructions: string[];
//   tips?: string[];
//   nutrition?: {
//     calories: number;
//     protein: string;
//     carbs: string;
//     fat: string;
//   };
// }

// export const recipes: Recipe[] = [
//   {
//     id: '1',
//     title: 'Classic French Omelette',
//     description: 'Fluffy, buttery French-style omelette with fresh herbs. Perfect for breakfast or brunch.',
//     image: 'https://images.pexels.com/photos/1279330/omelette-eggs-breakfast-food-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
//     cookingTime: 5,
//     servings: 1,
//     difficulty: 'easy',
//     ingredients: [
//       { amount: '3', name: 'large eggs' },
//       { amount: '1 tbsp', name: 'butter' },
//       { amount: '1 tbsp', name: 'fresh chives, chopped' },
//       { amount: 'to taste', name: 'salt and pepper' }
//     ],
//     instructions: [
//       'Crack eggs into a bowl and whisk vigorously until frothy',
//       'Season with salt and pepper',
//       'Heat butter in a non-stick skillet over medium-high heat',
//       'Pour eggs into skillet and stir continuously with a spatula',
//       'When eggs are partially set but still runny, stop stirring',
//       'Add chives and fold the omelette in half',
//       'Slide onto a plate and serve immediately'
//     ],
//     tips: [
//       'Use room temperature eggs for fluffier results',
//       'Don\'t overfill - less is more with French omelettes',
//       'Practice makes perfect - the technique takes time'
//     ],
//     nutrition: {
//       calories: 320,
//       protein: '22g',
//       carbs: '2g',
//       fat: '24g'
//     }
//   },
//   {
//     id: '2',
//     title: 'Mediterranean Quinoa Bowl',
//     description: 'Fresh quinoa with roasted vegetables and tahini dressing. Healthy and delicious.',
//     image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
//     cookingTime: 20,
//     servings: 2,
//     difficulty: 'easy',
//     ingredients: [
//       { amount: '1 cup', name: 'quinoa' },
//       { amount: '2 cups', name: 'water' },
//       { amount: '1 cup', name: 'cherry tomatoes' },
//       { amount: '1', name: 'cucumber, diced' },
//       { amount: '1/4 cup', name: 'feta cheese' },
//       { amount: '2 tbsp', name: 'tahini' }
//     ],
//     instructions: [
//       'Rinse quinoa thoroughly and cook with water for 15 minutes',
//       'While quinoa cooks, chop vegetables',
//       'Fluff quinoa with a fork when done',
//       'Combine quinoa with vegetables in a bowl',
//       'Drizzle with tahini and toss to combine',
//       'Top with feta cheese and serve'
//     ],
//     tips: [
//       'Toast quinoa before cooking for nuttier flavor',
//       'Add lemon juice to tahini for brightness',
//       'Meal prep by making extra quinoa for the week'
//     ],
//     nutrition: {
//       calories: 450,
//       protein: '15g',
//       carbs: '65g',
//       fat: '14g'
//     }
//   },
//   {
//     id: '3',
//     title: 'Hearty Chicken Soup',
//     description: 'Warm, comforting soup with free-range chicken and vegetables.',
//     image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800',
//     cookingTime: 45,
//     servings: 4,
//     difficulty: 'medium',
//     ingredients: [
//       { amount: '2', name: 'chicken breasts' },
//       { amount: '4 cups', name: 'chicken broth' },
//       { amount: '2', name: 'carrots, diced' },
//       { amount: '2', name: 'celery stalks' },
//       { amount: '1', name: 'onion, chopped' },
//       { amount: '3 cloves', name: 'garlic' }
//     ],
//     instructions: [
//       'Sauté onion, garlic, carrots, and celery in large pot',
//       'Add chicken and broth, bring to boil',
//       'Reduce heat and simmer for 30 minutes',
//       'Remove chicken, shred with forks',
//       'Return chicken to pot and season to taste',
//       'Serve hot with bread'
//     ],
//     tips: [
//       'Use rotisserie chicken for faster preparation',
//       'Add noodles or rice for heartier soup',
//       'Freezes well for up to 3 months'
//     ],
//     nutrition: {
//       calories: 380,
//       protein: '35g',
//       carbs: '12g',
//       fat: '8g'
//     }
//   }
// ];





// lib/recipes.ts
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: { amount: string; name: string; }[];
  instructions: string[];
  tips?: string[];
}

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic French Omelette',
    description: 'Fluffy, buttery French-style omelette with fresh herbs.',
    image: 'https://images.pexels.com/photos/1279330/omelette-eggs-breakfast-food-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
    cookingTime: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { amount: '3', name: 'large eggs' },
      { amount: '1 tbsp', name: 'butter' },
      { amount: '1 tbsp', name: 'fresh chives' }
    ],
    instructions: [
      'Whisk eggs until frothy',
      'Heat butter in skillet',
      'Pour eggs and stir continuously',
      'Fold and serve'
    ],
    tips: ['Use room temperature eggs']
  },
  {
    id: '2',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Fresh quinoa with roasted vegetables and tahini dressing.',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
    cookingTime: 20,
    servings: 2,
    difficulty: 'easy',
    ingredients: [
      { amount: '1 cup', name: 'quinoa' },
      { amount: '1 cup', name: 'cherry tomatoes' },
      { amount: '1', name: 'cucumber' }
    ],
    instructions: [
      'Cook quinoa for 15 minutes',
      'Chop vegetables',
      'Combine and serve'
    ],
    tips: ['Toast quinoa for better flavor']
  }
];