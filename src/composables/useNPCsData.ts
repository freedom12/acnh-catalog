import { ref, type Ref } from 'vue';
import type { NPC } from '../types';
import { loadNPCsData } from '../services/dataService';

export interface UseNPCsDataReturn {
  allNPCs: Ref<NPC[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

export function useNPCsData(): UseNPCsDataReturn {
  const allNPCs = ref<NPC[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      allNPCs.value = await loadNPCsData();
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    allNPCs,
    loading,
    error,
    loadData,
  };
}
