import { ref } from 'vue';
import type { Artwork } from '../types/artwork';
import { loadArtworkData } from '../services/dataService';

export function useArtworkData() {
  const allArtwork = ref<Artwork[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = '';
      allArtwork.value = await loadArtworkData();
    } catch (e) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
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
