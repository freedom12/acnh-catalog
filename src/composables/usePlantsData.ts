import type { Plant } from '../types/plant';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadPlantsData = async (): Promise<Plant[]> => {
  const response = await fetch(CONFIG.DATA_FILES.PLANTS);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const usePlantsData = createDataLoader<Plant>({
  loader: loadPlantsData,
  errorMessage: '加载植物数据失败',
});
