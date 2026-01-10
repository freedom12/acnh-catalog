import { ref } from 'vue';
import type { Plant } from '../types/plant';
import { loadPlantsData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export function usePlantsData() {
  const allPlants = ref<Plant[]>([]);
  const loading = ref(false);
  const error = ref('');

  const loadData = async () => {
    try {
      loading.value = true;
      error.value = '';
      allPlants.value = await loadPlantsData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('加载植物数据失败:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allPlants,
    loading,
    error,
    loadData,
  };
}
