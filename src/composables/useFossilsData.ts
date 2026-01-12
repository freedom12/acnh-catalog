import { ref } from 'vue';
import type { Fossil } from '../types/fossil';
import { loadFossilsData } from '../services/dataService';

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
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
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
