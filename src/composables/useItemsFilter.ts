import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { Item, FilterOptions } from '../types';
import { filterItems, sortItems } from '../services/filterService';
import { CONFIG } from '../config';

export interface UseItemsFilterReturn {
  filters: Ref<FilterOptions>;
  sortValue: Ref<string>;
  itemsPerPage: Ref<number | 'all'>;
  currentPage: Ref<number>;
  filteredItems: Ref<Item[]>;
  totalPages: ComputedRef<number>;
  itemsToDisplay: ComputedRef<Item[]>;
  handleFilterChange: () => void;
  handleSortChange: () => void;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (value: number | 'all') => void;
}

/**
 * 组合函数：管理物品筛选、排序和分页
 */
export function useItemsFilter(allItems: Ref<Item[]>): UseItemsFilterReturn {
  const filters = ref<FilterOptions>({
    searchTerm: '',
    category: '',
    ownedFilter: 'all',
    versionFilter: '',
    sourceFilter: '',
    sizeFilter: '',
    tagFilter: '',
    colorFilter: '',
    seriesFilter: ''
  });

  const sortValue = ref(CONFIG.SORT_OPTIONS.ID_ASC);
  const itemsPerPage = ref<number | 'all'>(CONFIG.PAGINATION.DEFAULT_PER_PAGE);
  const currentPage = ref(1);
  const filteredItems = ref<Item[]>([]);

  /**
   * 计算总页数
   */
  const totalPages = computed(() => {
    if (itemsPerPage.value === 'all') return 1;
    return Math.ceil(filteredItems.value.length / itemsPerPage.value);
  });

  /**
   * 计算当前页要显示的物品
   */
  const itemsToDisplay = computed(() => {
    if (itemsPerPage.value === 'all') {
      return filteredItems.value;
    }
    
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = Math.min(startIndex + itemsPerPage.value, filteredItems.value.length);
    return filteredItems.value.slice(startIndex, endIndex);
  });

  /**
   * 处理筛选变化
   */
  const handleFilterChange = (): void => {
    filteredItems.value = filterItems(allItems.value, filters.value);
    filteredItems.value = sortItems(filteredItems.value, sortValue.value);
    currentPage.value = 1; // 筛选后重置到第一页
  };

  /**
   * 处理排序变化
   */
  const handleSortChange = (): void => {
    filteredItems.value = sortItems(filteredItems.value, sortValue.value);
  };

  /**
   * 处理页码变化
   */
  const handlePageChange = (page: number): void => {
    currentPage.value = page;
  };

  /**
   * 处理每页显示数量变化
   */
  const handlePerPageChange = (value: number | 'all'): void => {
    itemsPerPage.value = value;
    currentPage.value = 1; // 改变每页数量后重置到第一页
  };

  // 初始化时设置筛选后的物品为所有物品
  filteredItems.value = [...allItems.value];

  return {
    filters,
    sortValue,
    itemsPerPage,
    currentPage,
    filteredItems,
    totalPages,
    itemsToDisplay,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePerPageChange
  };
}
