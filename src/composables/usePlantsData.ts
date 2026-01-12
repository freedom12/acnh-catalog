import { ref } from 'vue';
import type { Plant } from '../types/plant';
import { loadPlantsData } from '../services/dataService';

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
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
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
