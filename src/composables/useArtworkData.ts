import type { Artwork } from '../types/artwork';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadArtworkData = async (): Promise<Artwork[]> => {
  const response = await fetch(CONFIG.DATA_FILES.ARTWORKS);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useArtworkData = createDataLoader<Artwork>({
  loader: loadArtworkData,
  errorMessage: '加载艺术品数据失败',
});
