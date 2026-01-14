import { ref } from 'vue';
import { loadTranslations } from '../services/dataService';
import { useActivitysData } from './useActivitysData';

const isInitialized = ref(false);
const loading = ref(true);
const error = ref('');

export function useAppInit() {
  const { loadData: loadActivitys } = useActivitysData();

  const initialize = async () => {
    if (isInitialized.value) return;

    try {
      loading.value = true;
      error.value = '';

      // 并行加载翻译和活动数据
      await Promise.all([
        loadTranslations(),
        loadActivitys(),
      ]);

      isInitialized.value = true;
    } catch (err) {
      error.value = '初始化数据加载失败';
      console.error('初始化数据加载失败:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    isInitialized,
    loading,
    error,
    initialize,
  };
}