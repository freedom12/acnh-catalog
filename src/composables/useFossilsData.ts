import { ref } from 'vue';
import type { Fossil } from '../types/fossil';
import { loadFossilsData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export function useFossilsData() {
  const allFossils = ref<Fossil[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = '';
      allFossils.value = await loadFossilsData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('Failed to load fossils:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allFossils,
    loading,
    error,
    loadData,
  };
}
