export type MealCategory = 'breakfast' | 'lunch' | 'dinner';

export type Recipe = {
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
  // ── BREAKFAST ──
  {
    id: '1',
    title: 'Classic French Omelette',
    description: 'Fluffy, buttery French-style omelette with fresh herbs.',
    image: 'https://images.pexels.com/photos/1279330/omelette-eggs-breakfast-food-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
    cookingTime: 5,
    servings: 1,
    difficulty: 'easy',
    category: 'breakfast',
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
    category: 'dinner',
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
