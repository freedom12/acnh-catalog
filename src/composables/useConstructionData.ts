import { ref } from 'vue';
import type { Construction } from '../types/construction';
import { loadConstructionData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export function useConstructionData() {
  const allConstruction = ref<Construction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      allConstruction.value = await loadConstructionData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('Failed to load construction:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allConstruction,
    loading,
    error,
    loadData
  };
}
