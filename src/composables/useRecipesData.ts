import { ref } from 'vue';
import type { Recipe } from '../types/recipe';
import { loadRecipesData } from '../services/dataService';

const allRecipes = ref<Recipe[]>([]);
const recipeIdMap = ref<Record<number, Recipe>>({});
const loading = ref(false);
const error = ref('');
let isDataLoaded = false;

export function useRecipesData() {
  const loadData = async () => {
    if (isDataLoaded) {
      return;
    }
    try {
      loading.value = true;
      error.value = '';
      allRecipes.value = await loadRecipesData();
      recipeIdMap.value = {};
      allRecipes.value.forEach((recipe) => {
        recipeIdMap.value[recipe.id] = recipe;
      });
      isDataLoaded = true;
    } catch (e) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allRecipes,
    recipeIdMap,
    loading,
    error,
    loadData,
  };
}
