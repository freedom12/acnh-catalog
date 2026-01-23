import type { Recipe } from '../types/recipe';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadRecipesData = async (): Promise<Recipe[]> => {
  const response = await fetch(CONFIG.DATA_FILES.RECIPES);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useRecipesData = createDataLoader<Recipe>({
  loader: loadRecipesData,
  getIds: (recipe) => [recipe.id],
  errorMessage: '加载配方数据失败',
});
