import { ref, type Ref } from 'vue';
import type { NPC } from '../types';
import { loadNPCsData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export interface UseNPCsDataReturn {
  allNPCs: Ref<NPC[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

/**
 * 组合函数：管理NPC数据加载
 */
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
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('加载NPC数据失败:', err);
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
