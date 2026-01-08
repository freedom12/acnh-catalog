import { ref } from "vue";
import { type Creature } from "../types";
import { loadCreaturesData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

const allCreatures = ref<Creature[]>([]);
const loading = ref(false);
const error = ref("");
let isDataLoaded = false;

export function useCreaturesData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    try {
      loading.value = true;
      error.value = "";
      allCreatures.value = await loadCreaturesData();
      isDataLoaded = true;
    } catch (err) {
      console.error("加载生物数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
    } finally {
      loading.value = false;
    }
  };

  return {
    allCreatures,
    loading,
    error,
    loadData,
  };
}
