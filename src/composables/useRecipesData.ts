import { ref } from 'vue';
import type { Recipe } from '../types/recipe';
import { loadRecipesData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export function useRecipesData() {
  const allRecipes = ref<Recipe[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      allRecipes.value = await loadRecipesData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('Failed to load recipes:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allRecipes,
    loading,
    error,
    loadData
  };
}
