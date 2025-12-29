import { ref } from "vue";
import type { Construction } from "../types/construction";
import { loadConstructionsData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

export function useConstructionData() {
  const allConstruction = ref<Construction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await loadConstructionsData();
      allConstruction.value = data.map((item) => ({
        ...item,
        category: item.type || "Other",
      }));
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error("Failed to load construction:", e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allConstruction,
    loading,
    error,
    loadData,
  };
}
