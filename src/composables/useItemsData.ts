import { ref, type Ref } from 'vue';
import { ItemModel } from '../models/ItemModel';
import {
  loadTranslations,
  loadItemsData,
  loadCatalogData,
} from '../services/dataService';

const allItems = ref<ItemModel[]>([]) as Ref<ItemModel[]>;
const itemIdMap = ref<Record<number, ItemModel>>({});
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;

export function useItemsData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    try {
      loading.value = true;
      error.value = '';
      const [, acnhItems, ownedIds] = await Promise.all([
        loadTranslations(),
        loadItemsData(),
        loadCatalogData(),
      ]);

      allItems.value = acnhItems.map((item) => {
        const model = new ItemModel(item);
        model.owned = ownedIds.has(item.id);
        return model;
      });
      allItems.value.forEach((item) => {
        itemIdMap.value[item.id] = item;
      });
      isDataLoaded = true;
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * 使用上传的目录数据更新物品拥有状态
   */
  const updateCatalogData = (catalogData: {
    items: Array<{ label: string; unique_id: number }>;
  }): void => {
    const ownedIds = new Set<number>();
    catalogData.items.forEach((item) => {
      ownedIds.add(item.unique_id);
    });

    // 更新所有物品的拥有状态
    allItems.value.forEach((item) => {
      item.owned = ownedIds.has(item.id);
    });
  };

  return {
    allItems,
    itemIdMap,
    loading,
    error,
    loadData,
    updateCatalogData,
  };
}
