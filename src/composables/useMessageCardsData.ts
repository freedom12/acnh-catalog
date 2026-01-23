import type { MessageCard } from '../types/messagecard';
import { CONFIG } from '../config';
import { createDataLoader } from './core/useDataLoader';

export const useMessageCardsData = createDataLoader<MessageCard>({
  loader: async () => {
    const response = await fetch(CONFIG.DATA_FILES.MESSAGE_CARDS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<MessageCard[]>;
  },
  errorMessage: '加载信纸数据失败',
});
