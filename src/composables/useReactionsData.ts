import { ref, type Ref } from 'vue';
import type { Reaction } from '../types';
import { loadReactionsData } from '../services/dataService';

export interface UseReactionsDataReturn {
  allReactions: Ref<Reaction[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

export function useReactionsData(): UseReactionsDataReturn {
  const allReactions = ref<Reaction[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      allReactions.value = await loadReactionsData();
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    allReactions,
    loading,
    error,
    loadData,
  };
}
