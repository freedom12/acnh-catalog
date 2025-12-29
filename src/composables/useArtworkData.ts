import { ref } from "vue";
import type { Artwork } from "../types/artwork";
import { loadArtworkData } from "../services/dataService";
import { DATA_LOADING } from "../constants";

export function useArtworkData() {
  const allArtwork = ref<Artwork[]>([]);
  const loading = ref(false);
  const error = ref("");
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = "";
      allArtwork.value = await loadArtworkData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error("Failed to load artwork:", e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allArtwork,
    loading,
    error,
    loadData,
  };
}