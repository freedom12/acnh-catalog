import { ref, type Ref } from 'vue';
import { ItemModel } from '../models/ItemModel';
import { loadItemsData } from '../services/dataService';
import { useRecipesData } from './useRecipesData';
import { selections, saveSelections } from './useSelection';

const allItems = ref<ItemModel[]>([]) as Ref<ItemModel[]>;
const itemIdMap = ref<Record<number, ItemModel>>({});
const { loadData: loadRecipes } = useRecipesData();
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useItemsData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    // 如果正在加载中，返回现有的 Promise
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = '';
        const [acnhItems] = await Promise.all([loadItemsData(), loadRecipes()]);
        allItems.value = acnhItems.map((item) => {
          let itemModel = new ItemModel(item);
          itemIdMap.value[item.id] = itemModel;
          itemModel.variantGroups.forEach((group) => {
            group.forEach((pattern) => {
              if (!pattern.id) return;
              itemIdMap.value[pattern.id] = itemModel;
            });
          });
          return itemModel;
        });
        isDataLoaded = true;
      } catch (err) {
        error.value = '加载数据失败';
        console.error('加载数据失败:', err);
        loadingPromise = null; // 失败时重置，允许重试
      } finally {
        loading.value = false;
      }
    })();

    return loadingPromise;
  };

  /**
   * 使用上传的目录数据更新物品勾选状态
   */
  const updateCatalogData = (catalogData: {
    items: Array<{ label: string; unique_id: number }>;
  }, selectionKey: string = 'items'): void => {
    // 确保指定字段存在
    if (!selections.value[selectionKey]) {
      selections.value[selectionKey] = {};
    }

    // 设置上传的物品为已勾选
    catalogData.items.forEach((item) => {
      selections.value[selectionKey]![String(item.unique_id)] = true;
    });

    // 保存到 localStorage
    saveSelections();
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
