import { ref, type Ref } from 'vue';
import type { Villager } from '../types';
import { loadVillagersData } from '../services/dataService';

export interface UseVillagersDataReturn {
  allVillagers: Ref<Villager[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

export function useVillagersData(): UseVillagersDataReturn {
  const allVillagers = ref<Villager[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      allVillagers.value = await loadVillagersData();
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    allVillagers,
    loading,
    error,
    loadData,
  };
}
