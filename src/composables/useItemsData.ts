import { ref, type Ref } from "vue";
import type { Item } from "../types";
import {
  loadTranslations,
  loadItemsData,
  loadCatalogData,
  processItemsData,
} from "../services/dataService";
import { DATA_LOADING } from "../constants";

export interface UseItemsDataReturn {
  allItems: Ref<Item[]>;
  itemNameMap: Ref<Record<string, Item>>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
  updateCatalogData: (catalogData: {
    items: Array<{ label: string; unique_id: string }>;
  }) => void;
}

// 全局状态，所有组件共享
const allItems = ref<Item[]>([]);
const itemNameMap = ref<Record<string, Item>>({});
const loading = ref(true);
const error = ref("");
let isDataLoaded = false; // 标记数据是否已加载

/**
 * 组合函数：管理物品数据加载
 */
export function useItemsData(): UseItemsDataReturn {
  /**
   * 加载所有数据
   */
  const loadData = async (): Promise<void> => {
    // 如果数据已经加载过，直接返回
    if (isDataLoaded) {
      loading.value = false;
      return;
    }

    try {
      loading.value = true;
      error.value = "";

      // 并行加载翻译和物品数据
      const [, acnhItems, ownedData] = await Promise.all([
        loadTranslations(),
        loadItemsData(),
        loadCatalogData(),
      ]);

      // 处理物品数据
      allItems.value = processItemsData(acnhItems, ownedData);

      const itemMap: Record<string, Item> = {};
      allItems.value.forEach((item) => {
        const name = item.originalData?.name;
        if (name) {
          itemMap[name] = item;
        }
      });
      itemNameMap.value = itemMap;

      loading.value = false;
      isDataLoaded = true; // 标记数据已加载
    } catch (err) {
      console.error("加载数据失败:", err);
      error.value = DATA_LOADING.ERROR_GENERIC;
      loading.value = false;
    }
  };

  /**
   * 使用上传的目录数据更新物品拥有状态
   */
  const updateCatalogData = (catalogData: {
    items: Array<{ label: string; unique_id: string }>;
  }): void => {
    const ownedNames = new Set<string>();
    const ownedIds = new Set<string>();

    catalogData.items.forEach((item) => {
      ownedNames.add(item.label);
      ownedIds.add(item.unique_id);
    });

    // 更新所有物品的拥有状态
    allItems.value = allItems.value.map((item) => {
      const uniqueEntryId = item.originalData?.uniqueEntryId || "";
      const internalId = item.originalData?.internalId?.toString() || "";

      return {
        ...item,
        owned:
          ownedNames.has(item.name) ||
          ownedIds.has(internalId) ||
          ownedIds.has(uniqueEntryId),
      };
    });
  };

  return {
    allItems,
    itemNameMap,
    loading,
    error,
    loadData,
    updateCatalogData,
  };
}
