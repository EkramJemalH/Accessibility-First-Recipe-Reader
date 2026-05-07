import { Recipe } from './recipes';

export interface FilterOptions {
  query?: string;
  category?: string;
  difficulty?: string;
}

export type SortOption = 'default' | 'time-asc' | 'time-desc' | 'alphabetical';

/**
 * Filters a list of recipes based on search query, category, and difficulty.
 * Pure function — does not mutate the input array.
 *
 * - query: case-insensitive match against recipe title OR description (skipped if empty)
 * - category: exact match against recipe.category (skipped if 'all' or empty)
 * - difficulty: exact match against recipe.difficulty (skipped if 'all' or empty)
 */
export function filterRecipes(
  recipes: Recipe[],
  { query = '', category = '', difficulty = '' }: FilterOptions
): Recipe[] {
  return recipes.filter((recipe) => {
    // Search filter: skip if query is empty
    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      const matchesTitle = recipe.title.toLowerCase().includes(lowerQuery);
      const matchesDescription = recipe.description.toLowerCase().includes(lowerQuery);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Category filter: skip if 'all' or empty
    if (category !== '' && category !== 'all') {
      if (recipe.category !== category) {
        return false;
      }
    }

    // Difficulty filter: skip if 'all' or empty
    if (difficulty !== '' && difficulty !== 'all') {
      if (recipe.difficulty !== difficulty) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts a list of recipes by the given sort option.
 * Pure function — returns a new array, does not mutate the input.
 *
 * - 'default': return recipes in original order
 * - 'time-asc': sort by cookingTime ascending
 * - 'time-desc': sort by cookingTime descending
 * - 'alphabetical': sort by title alphabetically (case-insensitive)
 */
export function sortRecipes(recipes: Recipe[], sortOption: SortOption): Recipe[] {
  // Always work on a copy to avoid mutating the input
  const copy = [...recipes];

  switch (sortOption) {
    case 'time-asc':
      return copy.sort((a, b) => a.cookingTime - b.cookingTime);

    case 'time-desc':
      return copy.sort((a, b) => b.cookingTime - a.cookingTime);

    case 'alphabetical':
      return copy.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );

    case 'default':
    default:
      return copy;
  }
}