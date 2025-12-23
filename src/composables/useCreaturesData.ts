import { ref, type Ref } from 'vue';
import type { Creature } from '../types';
import { loadCreaturesData } from '../services/dataService';

export interface UseCreaturesDataReturn {
  allCreatures: Ref<Creature[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

/**
 * 组合函数：管理生物数据加载
 */
export function useCreaturesData(): UseCreaturesDataReturn {
  const allCreatures = ref<Creature[]>([]);
  const loading = ref(false);
  const error = ref('');

  /**
   * 加载生物数据
   */
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      
      allCreatures.value = await loadCreaturesData();
      
      loading.value = false;
    } catch (err) {
      console.error('加载生物数据失败:', err);
      error.value = '加载生物数据失败，请确保数据文件存在';
      loading.value = false;
    }
  };

  return {
    allCreatures,
    loading,
    error,
    loadData
  };
}
