import { type Creature } from '../types';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

const loadCreaturesData = async (): Promise<Creature[]> => {
  const response = await fetch(CONFIG.DATA_FILES.CREATURES);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const useCreaturesData = createDataLoader<Creature>({
  loader: loadCreaturesData,
  errorMessage: '加载生物数据失败',
});
