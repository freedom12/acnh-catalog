import { ref, computed, type Ref } from 'vue';
import type { FilterOptionValue } from '../components/FilterSection.vue';

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
 * @param filterMode 筛选模式：'append' - filterFn 作为附加筛选（默认），'replace' - filterFn 完全替换默认筛选
 */
export function useFilter<T>(
  allData: Ref<T[]>,
  filterFn?: (
    item: T,
    searchQuery: string,
    selectedFilters: Record<string, FilterOptionValue>
  ) => boolean,
  filterMode: 'append' | 'replace' = 'append'
): UseFilterReturn<T> {
  const searchQuery = ref('');
  const selectedFilters = ref<Record<string, FilterOptionValue>>({});

  const filteredData = computed(() => {
    let result = allData.value;

    // 如果使用 replace 模式且提供了自定义筛选函数，则完全替换默认筛选
    if (filterMode === 'replace' && filterFn) {
      return result.filter((item) =>
        filterFn(item, searchQuery.value, selectedFilters.value)
      );
    }

    // append 模式：使用默认筛选 + 自定义筛选
    // 搜索筛选
    if (searchQuery.value) {
      const lowerQuery = searchQuery.value.toLowerCase();
      result = result.filter(
        (item) =>
          (item as any).name?.toLowerCase().includes(lowerQuery) ||
          (item as any).rawName?.toLowerCase().includes(lowerQuery)
      );
    }

    // 类别筛选（基于 selectedFilters）
    Object.entries(selectedFilters.value).forEach(([key, value]) => {
      if (value) {
        result = result.filter(
          (item) => (item as any)[key] === value || (item as any)[key] === undefined
        );
      }
    });

    // 自定义筛选函数（附加模式）
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
    searchQuery.value = filters.searchQuery.trim();

    // 清理 selectedFilters，只保留有效的筛选值
    const cleanedFilters: Record<string, FilterOptionValue> = {};
    Object.entries(filters.selectedFilters).forEach(([key, value]) => {
      // 只保留非空、非0的有效筛选值
      if (value && value !== '' && value !== 0) {
        cleanedFilters[key] = value;
      }
    });
    selectedFilters.value = cleanedFilters;
  };

  return {
    searchQuery,
    selectedFilters,
    filteredData,
    handleFiltersChanged,
  };
}
