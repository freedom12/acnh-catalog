import { ref } from 'vue';
import type { Music } from '../types/music';
import { loadMusicData } from '../services/dataService';

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
      error.value = '加载数据失败';
      console.error('加载数据失败:', e);
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
