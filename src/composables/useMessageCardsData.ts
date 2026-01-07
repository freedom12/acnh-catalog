import { ref, type Ref } from "vue";
import type { MessageCard } from "../types/messagecard";
import { loadMessageCardsData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

export interface UseMessageCardsDataReturn {
  allMessageCards: Ref<MessageCard[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

const allMessageCards = ref<MessageCard[]>([]) as Ref<MessageCard[]>;
const loading = ref(true);
const error = ref("");
let isDataLoaded = false;

export function useMessageCardsData(): UseMessageCardsDataReturn {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      loading.value = false;
      return;
    }
    try {
      loading.value = true;
      error.value = ""
      allMessageCards.value = await loadMessageCardsData();
      isDataLoaded = true;
    } catch (err) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error("加载贺卡数据失败:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    allMessageCards,
    loading,
    error,
    loadData,
  };
}