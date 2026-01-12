import { ref } from 'vue';
import type { Construction } from '../types/construction';
import { loadConstructionsData } from '../services/dataService';

export function useConstructionData() {
  const allConstruction = ref<Construction[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = '';
      allConstruction.value = await loadConstructionsData();
    } catch (e) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allConstruction,
    loading,
    error,
    loadData,
  };
}
