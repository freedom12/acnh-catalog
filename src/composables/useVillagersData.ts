import type { Villager } from '../types';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadVillagersData = async (): Promise<Villager[]> => {
  const response = await fetch(CONFIG.DATA_FILES.VILLAGERS);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useVillagersData = createDataLoader<Villager>({
  loader: loadVillagersData,
  errorMessage: '加载村民数据失败',
});
