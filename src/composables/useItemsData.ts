import { ref, type Ref } from 'vue';
import type { Item } from '../types';
import { loadTranslations, loadItemsData, loadCatalogData, processItemsData } from '../services/dataService';

export interface UseItemsDataReturn {
  allItems: Ref<Item[]>;
  loading: Ref<boolean>;
  error: Ref<string>;
  loadData: () => Promise<void>;
}

/**
 * 组合函数：管理物品数据加载
 */
export function useItemsData(): UseItemsDataReturn {
  const allItems = ref<Item[]>([]);
  const loading = ref(true);
  const error = ref('');

  /**
   * 加载所有数据
   */
  const loadData = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = '';
      
      // 并行加载翻译和物品数据
      const [, acnhItems, ownedData] = await Promise.all([
        loadTranslations(),
        loadItemsData(),
        loadCatalogData()
      ]);
      
      // 处理物品数据
      allItems.value = processItemsData(acnhItems, ownedData);
      
      loading.value = false;
    } catch (err) {
      console.error('加载数据失败:', err);
      error.value = '加载数据失败，请确保数据文件存在';
      loading.value = false;
    }
  };

  return {
    allItems,
    loading,
    error,
    loadData
  };
}
