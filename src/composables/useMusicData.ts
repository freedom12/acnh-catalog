import { ref } from 'vue';
import type { Music } from '../types/music';
import { loadMusicData } from '../services/dataService';
import { DATA_LOADING } from '../constants';

export function useMusicData() {
  const allMusic = ref<Music[]>([]);
  const loading = ref(false);
  const error = ref('');
  const loadData = async () => {
    try {
      loading.value = true;
      error.value = '';
      allMusic.value = await loadMusicData();
    } catch (e) {
      error.value = DATA_LOADING.ERROR_GENERIC;
      console.error('Failed to load music:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    allMusic,
    loading,
    error,
    loadData,
  };
}
