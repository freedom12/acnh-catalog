import { ref, type Ref } from 'vue';
import type { NPC } from '../types';
import { loadNPCsData } from '../services/dataService';

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

  /**
   * 加载NPC数据
   */
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      
      allNPCs.value = await loadNPCsData();
      
      loading.value = false;
    } catch (err) {
      console.error('加载NPC数据失败:', err);
      error.value = '加载NPC数据失败，请确保数据文件存在';
      loading.value = false;
    }
  };

  return {
    allNPCs,
    loading,
    error,
    loadData
  };
}
