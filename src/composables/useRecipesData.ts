import { ref } from 'vue';
import type { Recipe } from '../types/recipe';
import { loadRecipesData } from '../services/dataService';

const allRecipes = ref<Recipe[]>([]);
const recipeIdMap = ref<Record<number, Recipe>>({});
const loading = ref(false);
const error = ref('');
let loadingPromise: Promise<void> | null = null;
let isDataLoaded = false;

export function useRecipesData() {
  const loadData = async () => {
    if (isDataLoaded) {
      return;
    }
    if (loadingPromise) {
      return loadingPromise;
    }
    loadingPromise = (async () => {
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
        loadingPromise = null;
      } finally {
        loading.value = false;
      }
    })();
    return loadingPromise;
  };

  return {
    allRecipes,
    recipeIdMap,
    loading,
    error,
    loadData,
  };
}
