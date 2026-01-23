import type { Construction } from '../types/construction';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

export const useConstructionData = createDataLoader<Construction>({
  loader: async () => {
    const response = await fetch(CONFIG.DATA_FILES.CONSTRUCTIONS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<Construction[]>;
  },
  errorMessage: '加载建筑数据失败',
});
