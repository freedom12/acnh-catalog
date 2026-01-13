import { ref } from 'vue';
import { type Creature } from '../types';
import { loadCreaturesData } from '../services/dataService';

const allCreatures = ref<Creature[]>([]);
const loading = ref(false);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useCreaturesData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    if (loadingPromise) {
      return loadingPromise;
    }
    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = '';
        allCreatures.value = await loadCreaturesData();
        isDataLoaded = true;
      } catch (err) {
        error.value = '加载数据失败';
        console.error('加载数据失败:', err);
        loadingPromise = null;
      } finally {
        loading.value = false;
      }
    })();
    return loadingPromise;
  };

  return {
    allCreatures,
    loading,
    error,
    loadData,
  };
}
