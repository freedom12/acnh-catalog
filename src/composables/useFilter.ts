import { ref, computed, type Ref } from "vue";
import type { FilterOptionValue } from "../components/FilterSection.vue";

export interface UseFilterReturn<T> {
  searchQuery: Ref<string>;
  selectedFilters: Ref<Record<string, FilterOptionValue>>;
  filteredData: Ref<T[]>;
  handleFiltersChanged: (filters: {
    searchQuery: string;
    selectedFilters: Record<string, FilterOptionValue>;
  }) => void;
}

/**
 * 通用筛选组合函数：处理搜索和类别筛选
 * @param allData 所有数据
 * @param filterFn 自定义筛选函数（可选，用于复杂筛选逻辑）
 */
export function useFilter<T>(
  allData: Ref<T[]>,
  filterFn?: (
    item: T,
    searchQuery: string,
    selectedFilters: Record<string, FilterOptionValue>
  ) => boolean
): UseFilterReturn<T> {
  const searchQuery = ref("");
  const selectedFilters = ref<Record<string, FilterOptionValue>>({});

  const filteredData = computed(() => {
    let result = allData.value;

    // 搜索筛选
    if (searchQuery.value) {
      result = result.filter((item) =>
        (item as any).name
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    }

    // 类别筛选（基于 selectedFilters）
    Object.entries(selectedFilters.value).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== 0) {
        result = result.filter((item) => (item as any)[key] === value);
      }
    });

    // 自定义筛选函数（如果提供）
    if (filterFn) {
      result = result.filter((item) =>
        filterFn(item, searchQuery.value, selectedFilters.value)
      );
    }

    return result;
  });

  const handleFiltersChanged = (filters: {
    searchQuery: string;
    selectedFilters: Record<string, FilterOptionValue>;
  }) => {
    searchQuery.value = filters.searchQuery;
    selectedFilters.value = filters.selectedFilters;
  };

  return {
    searchQuery,
    selectedFilters,
    filteredData,
    handleFiltersChanged,
  };
}
