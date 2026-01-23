import type { Reaction } from '../types';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

export const useReactionsData = createDataLoader<Reaction>({
  loader: async () => {
    const response = await fetch(CONFIG.DATA_FILES.REACTIONS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<Reaction[]>;
  },
  errorMessage: '加载表情数据失败',
});
