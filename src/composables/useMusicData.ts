import type { Music } from '../types/music';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadMusicData = async (): Promise<Music[]> => {
  const response = await fetch(CONFIG.DATA_FILES.MUSICS);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useMusicData = createDataLoader<Music>({
  loader: loadMusicData,
  errorMessage: '加载音乐数据失败',
});
