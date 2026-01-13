<template>
  <div class="filter-container">
    <div class="stats">
      <div class="stats-content">
        <div v-if="props.totalCount !== undefined">
          总数: {{ props.totalCount.toLocaleString() }}
        </div>
        <div v-if="props.currentCount !== undefined">
          当前: {{ props.currentCount.toLocaleString() }}
        </div>
        <div v-for="stat in props.extraStats" :key="stat.label">
          {{ stat.label }}: {{ stat.value.toLocaleString() }}
        </div>
        <slot name="stats"></slot>
      </div>
      <div class="action-buttons">
        <slot name="action-buttons"></slot>
        <ToggleGroup v-model="viewMode" :options="viewModeOptions" />
        <button class="action-btn primary round-btn" @click="toggle">
          <span class="icon">{{ isExpanded ? '▲' : '▼' }}</span>
        </button>
      </div>
    </div>
    <div v-if="isExpanded" class="filter-expanded-content">
      <div class="filter-search">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索..."
            @input="handleSearch(($event.target as HTMLInputElement).value)"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="search-clear-btn"
            aria-label="清空搜索"
            @click="handleClearSearch"
          >
            X
          </button>
        </div>
        <button class="action-btn danger" @click="handleClearFilters">清除筛选</button>
      </div>
      <div v-if="filters.length > 0" class="filter-options">
        <div v-for="filter in filters" :key="filter.value" class="filter-option-group">
          <label v-if="filters.length > 1" class="filter-label">{{ filter.label }}</label>
          <!-- 单个筛选维度时显示按钮 -->
          <div v-if="filters.length === 1" class="filter-buttons">
            <button
              v-for="option in filter.options"
              :key="option.value"
              class="filter-btn"
              :class="{
                active: getSelectedValue(filter.value) === option.value,
              }"
              @click="
                handleFilterChange({
                  dimension: filter.value,
                  value: option.value,
                })
              "
            >
              <img
                v-if="option.icon"
                :src="option.icon"
                :alt="option.label"
                class="inline-icon"
                loading="lazy"
              />
              <span>{{ option.label }}</span>
            </button>
          </div>
          <!-- 多个筛选维度时显示下拉框 -->
          <select
            v-else
            class="filter-select"
            :value="getSelectedValue(filter.value)"
            @change="
              handleFilterChange({
                dimension: filter.value,
                value: convertToT(($event.target as HTMLSelectElement).value, filter),
              })
            "
          >
            <option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      <slot name="filter-controls"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useViewMode } from '../composables/useViewMode';
import { useDebounce } from '../composables/useDebounce';
import ToggleGroup from './ToggleGroup.vue';

export type FilterOptionValue = string | number;

export interface FilterOption {
  value: FilterOptionValue;
  label: string;
  icon?: string; // 图标 URL
}

export interface Filter {
  label: string;
  value: string;
  options: FilterOption[];
}

const emit = defineEmits<{
  filtersChanged: [
    filters: {
      searchQuery: string;
      selectedFilters: Record<string, FilterOptionValue>;
    },
  ];
}>();

const isExpanded = ref(false);

const searchQuery = ref('');
const debouncedSearchQuery = useDebounce(searchQuery, 300);
const selectedFilters = ref<Record<string, FilterOptionValue>>({});
const filters = ref<Filter[]>([]);

// 使用全局共享的视图模式
const { viewMode } = useViewMode();

// 视图模式选项
const viewModeOptions = [
  { value: 'detailed', label: '详细' },
  { value: 'simple', label: '简略' },
];

const props = defineProps<{
  filters?: Filter[];
  totalCount?: number;
  currentCount?: number;
  extraStats?: Array<{ label: string; value: number }>;
}>();
// 并为每个筛选维度添加"全部"选项
const initializeDefaultFilters = () => {
  if (props.filters) {
    const newFilters: Record<string, FilterOptionValue> = {};
    const newFiltersWithAll: Filter[] = [];

    props.filters.forEach((filter) => {
      // 根据filter的第一个选项的类型决定"全部"选项的值
      const firstOption = filter.options[0];
      let allValue: FilterOptionValue = 0; // 默认数字0
      if (firstOption && typeof firstOption.value === 'string') {
        allValue = ''; // 如果第一个选项是字符串，使用''
      }

      newFilters[filter.value] = allValue;

      // 为每个筛选维度添加"全部"选项
      newFiltersWithAll.push({
        ...filter,
        options: [{ value: allValue, label: '全部' }, ...filter.options],
      });
    });

    selectedFilters.value = newFilters;
    filters.value = newFiltersWithAll;

    emit('filtersChanged', {
      searchQuery: searchQuery.value,
      selectedFilters: selectedFilters.value,
    });
  }
};

// 监听filters变化，初始化默认选择
watch(() => props.filters, initializeDefaultFilters, { immediate: true });

// 监听防抖后的搜索查询
watch(debouncedSearchQuery, () => {
  emit('filtersChanged', {
    searchQuery: debouncedSearchQuery.value,
    selectedFilters: selectedFilters.value,
  });
});

const getSelectedValue = (dimension: string): FilterOptionValue => {
  return selectedFilters.value[dimension]!;
};

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const convertToT = (value: string, filter: Filter): FilterOptionValue => {
  if (filter.options[0] && typeof filter.options[0].value === 'number') {
    return parseInt(value);
  } else {
    return value;
  }
};

const handleFilterChange = (event: { dimension: string; value: FilterOptionValue }) => {
  selectedFilters.value = {
    ...selectedFilters.value,
    [event.dimension]: event.value,
  };
  emit('filtersChanged', {
    searchQuery: searchQuery.value,
    selectedFilters: selectedFilters.value,
  });
};

const handleClearFilters = () => {
  searchQuery.value = '';
  // 将所有筛选重置为"全部"
  if (filters.value.length > 0) {
    const clearedFilters: Record<string, FilterOptionValue> = {};
    filters.value.forEach((filter) => {
      clearedFilters[filter.value] = filter.options[0]?.value ?? '';
    });
    selectedFilters.value = clearedFilters;
  } else {
    selectedFilters.value = {};
  }
  emit('filtersChanged', {
    searchQuery: '',
    selectedFilters: selectedFilters.value,
  });
};

const handleClearSearch = () => {
  searchQuery.value = '';
  emit('filtersChanged', {
    searchQuery: '',
    selectedFilters: selectedFilters.value,
  });
};
</script>

<style scoped lang="scss">
@use '../styles/view-styles';

/* 筛选器容器 */
.filter-container {
  background-color: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-md, 16px);
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm, 0 2px 4px rgb(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

/* 操作按钮区 */
.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 展开内容区 */
.filter-expanded-content {
  margin-top: var(--spacing-md, 16px);
  padding-top: var(--spacing-md, 16px);
  border-top: 1px solid var(--border-color, #e8e8e8);
}

/* 搜索栏 */
.filter-search {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.filter-search input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: var(--border-radius-xl);
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.filter-search input:focus {
  outline: none;
  border-color: var(--primary-color, #4a9b4f);
}

.search-clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--text-secondary, #888);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  line-height: 1;
}

.search-clear-btn:hover {
  color: var(--text-primary, #333);
}

/* 筛选选项容器 */
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

/* 筛选选项组 */
.filter-option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

/* 筛选标签 */
.filter-label {
  font-weight: 600;
  color: var(--text-primary, #333);
  white-space: nowrap;
  margin: 0;
}

/* 筛选下拉框 */
.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: var(--border-radius-xl);
  background: white;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color, #4a9b4f);
}

/* 筛选按钮容器 */
.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 筛选按钮 */
.filter-btn {
  padding: 8px 16px;
  color: var(--success-color, #28a745);
  border: 1px solid var(--success-color, #28a745);
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgb(0, 0, 0, 0.1);
  white-space: nowrap;
}

.filter-btn:hover {
  background: var(--bg-hover, #f8f9fa);
  box-shadow: 0 2px 4px rgb(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: var(--success-color, #28a745);
  color: white;
  border-color: var(--success-color, #28a745);
}
</style>
