import { ref, computed, type Ref, type ComputedRef } from "vue";
import type { FilterOptions } from "../types";
import { ItemModel } from "../models/ItemModel";
import { filterItems, sortItems } from "../services/filterService";
import { CONFIG } from "../config";

export interface UseItemsFilterReturn {
  filters: Ref<FilterOptions>;
  sortValue: Ref<string>;
  itemsPerPage: Ref<number | "all">;
  currentPage: Ref<number>;
  filteredItems: Ref<ItemModel[]>;
  totalPages: ComputedRef<number>;
  itemsToDisplay: ComputedRef<ItemModel[]>;
  handleFilterChange: () => void;
  handleSortChange: () => void;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (value: number | "all") => void;
}

/**
 * 组合函数：管理物品筛选、排序和分页
 */
export function useItemsFilter(allItems: Ref<ItemModel[]>): UseItemsFilterReturn {
  const filters = ref<FilterOptions>({
    searchTerm: "",
    category: undefined,
    ownedFilter: undefined,
    versionFilter: undefined,
    sourceFilter: "",
    sizeFilter: undefined,
    tagFilter: "",
    colorFilter: undefined,
    seriesFilter: "",
    themeFilter: "",
    styleFilter: "",
  });

  const sortValue = ref(CONFIG.SORT_OPTIONS.ID_ASC);
  const itemsPerPage = ref<number | "all">(CONFIG.PAGINATION.DEFAULT_PER_PAGE);
  const currentPage = ref(1);
  const filteredItems = ref<ItemModel[]>([]);

  /**
   * 计算总页数
   */
  const totalPages = computed(() => {
    if (itemsPerPage.value === "all") return 1;
    return Math.ceil(filteredItems.value.length / itemsPerPage.value);
  });

  /**
   * 计算当前页要显示的物品
   */
  const itemsToDisplay = computed(() => {
    if (itemsPerPage.value === "all") {
      return filteredItems.value;
    }

    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = Math.min(
      startIndex + itemsPerPage.value,
      filteredItems.value.length
    );
    return filteredItems.value.slice(startIndex, endIndex);
  });

  const handleFilterChange = (): void => {
    filteredItems.value = filterItems(allItems.value, filters.value);
    filteredItems.value = sortItems(filteredItems.value as ItemModel[], sortValue.value);
    currentPage.value = 1; // 筛选后重置到第一页
  };

  const handleSortChange = (): void => {
    filteredItems.value = sortItems(filteredItems.value as ItemModel[], sortValue.value);
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
  const handlePerPageChange = (value: number | "all"): void => {
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
    filteredItems: filteredItems as Ref<ItemModel[]>,
    totalPages,
    itemsToDisplay: itemsToDisplay as ComputedRef<ItemModel[]>,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePerPageChange,
  };
}
