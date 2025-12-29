import { ref, type Ref } from "vue";
import type { Reaction } from "../types";
import { loadReactionsData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

export interface UseReactionsDataReturn {
  allReactions: Ref<Reaction[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

/**
 * 组合函数：管理表情反应数据加载
 */
export function useReactionsData(): UseReactionsDataReturn {
  const allReactions = ref<Reaction[]>([]);
  const loading = ref(false);
  const error = ref("");
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = "";
      allReactions.value = await loadReactionsData();
      loading.value = false;
    } catch (err) {
      console.error("加载表情反应数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
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
