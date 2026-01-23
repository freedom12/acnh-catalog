import type { Achievement } from '../types/achievement';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

export const useAchievementsData = createDataLoader<Achievement>({
  loader: async () => {
    const response = await fetch(CONFIG.DATA_FILES.ACHIEVEMENTS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<Achievement[]>;
  },
  getIds: (achievement) => [achievement.id],
  errorMessage: '加载成就数据失败',
});
