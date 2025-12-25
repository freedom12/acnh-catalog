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

// 全局状态，所有组件共享
const allMessageCards = ref<MessageCard[]>([]) as Ref<MessageCard[]>;
const loading = ref(true);
const error = ref("");
let isDataLoaded = false; // 标记数据是否已加载

/**
 * 组合函数：管理消息卡片数据加载
 */
export function useMessageCardsData(): UseMessageCardsDataReturn {
  /**
   * 加载所有数据
   */
  const loadData = async (): Promise<void> => {
    // 如果数据已经加载过，直接返回
    if (isDataLoaded) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value = "";

      // 加载消息卡片数据
      allMessageCards.value = await loadMessageCardsData();
      isDataLoaded = true;
      loading.value = false;
    } catch (err) {
      console.error("加载消息卡片数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
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