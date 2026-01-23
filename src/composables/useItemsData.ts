import { computed, type Ref } from 'vue';
import { type Item } from '../types';
import { ItemModel } from '../models/ItemModel';
import { CONFIG } from '../config';
import { useRecipesData } from './useRecipesData';
import { selections, saveSelections } from './useSelection';
import { createDataLoader } from './core/useDataLoader';

// 确保配方数据先加载
const { loadData: loadRecipes } = useRecipesData();

const useItemsDataLoader = createDataLoader<Item, ItemModel>({
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

export function useItemsData() {
  const { data, idMap, status, error, loadData } = useItemsDataLoader();

  const loading = computed(() => status.value === 'loading');

  /**
   * 使用上传的目录数据更新物品勾选状态
   */
  const updateCatalogData = (
    catalogData: {
      items: Array<{ unique_id: number; variations?: Array<{ unique_id: number }> }>;
    },
    selectionKey: string = 'items'
  ): void => {
    // 确保指定字段存在
    if (!selections.value[selectionKey]) {
      selections.value[selectionKey] = {};
    }

    // 设置上传的物品为已勾选
    catalogData.items.forEach((item) => {
      selections.value[selectionKey]![String(item.unique_id)] = true;
      item.variations?.forEach((variation) => {
        selections.value[selectionKey]![String(variation.unique_id)] = true;
      });
    });

    // 保存到 localStorage
    saveSelections();
  };

  return {
    allItems: data as Ref<ItemModel[]>,
    itemIdMap: idMap as Ref<Record<number, ItemModel>>,
    loading,
    error,
    loadData,
    updateCatalogData,
  };
}
