import type { NPC } from '../types';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

export const useNPCsData = createDataLoader<NPC>({
  loader: async () => {
    const response = await fetch(CONFIG.DATA_FILES.NPCS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<NPC[]>;
  },
  errorMessage: '加载NPC数据失败',
});
