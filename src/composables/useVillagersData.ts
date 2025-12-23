import { ref, type Ref } from 'vue';
import type { Villager } from '../types';
import { loadVillagersData } from '../services/dataService';

export interface UseVillagersDataReturn {
  allVillagers: Ref<Villager[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

/**
 * 组合函数：管理村民数据加载
 */
export function useVillagersData(): UseVillagersDataReturn {
  const allVillagers = ref<Villager[]>([]);
  const loading = ref(false);
  const error = ref('');

  /**
   * 加载村民数据
   */
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      
      allVillagers.value = await loadVillagersData();
      
      loading.value = false;
    } catch (err) {
      console.error('加载村民数据失败:', err);
      error.value = '加载村民数据失败，请确保数据文件存在';
      loading.value = false;
    }
  };

  return {
    allVillagers,
    loading,
    error,
    loadData
  };
}
