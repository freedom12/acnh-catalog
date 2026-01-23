import { type Item } from '../types';
import { ItemModel } from '../models/ItemModel';
import { CONFIG } from '../config';
import { useRecipesData } from './useRecipesData';
import { createDataLoader } from './core/useDataLoader';

// 确保配方数据先加载
const { loadData: loadRecipes } = useRecipesData();

export const useItemsData = createDataLoader<Item, ItemModel>({
  loader: async () => {
    // 先加载配方数据（ItemModel 依赖它）
    await loadRecipes();
    const response = await fetch(CONFIG.DATA_FILES.ITEMS);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json() as Promise<Item[]>;
  },
  transform: (item) => new ItemModel(item),
  getIds: (model) => {
    // 主 ID
    const ids: number[] = [model.id];
    // 变体 ID
    model.variantGroups.forEach((group) => {
      group.forEach((pattern) => {
        if (pattern.id) {
          ids.push(pattern.id);
        }
      });
    });
    return ids;
  },
  errorMessage: '加载物品数据失败',
});
