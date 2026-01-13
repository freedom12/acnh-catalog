import { ref, type Ref } from 'vue';
import type { MessageCard } from '../types/messagecard';
import { loadMessageCardsData } from '../services/dataService';

export interface UseMessageCardsDataReturn {
  allMessageCards: Ref<MessageCard[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

const allMessageCards = ref<MessageCard[]>([]) as Ref<MessageCard[]>;
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useMessageCardsData(): UseMessageCardsDataReturn {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      loading.value = false;
      return;
    }
    if (loadingPromise) {
      return loadingPromise;
    }
    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = '';
        allMessageCards.value = await loadMessageCardsData();
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
    allMessageCards,
    loading,
    error,
    loadData,
  };
}
