import type { Fossil } from '../types/fossil';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadFossilsData = async (): Promise<Fossil[]> => {
  const response = await fetch(CONFIG.DATA_FILES.FOSSILS);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useFossilsData = createDataLoader<Fossil>({
  loader: loadFossilsData,
  errorMessage: '加载化石数据失败',
});
