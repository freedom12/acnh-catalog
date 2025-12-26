<script setup lang="ts">
import { watch, computed, onMounted, ref } from "vue";
import type { FilterOptions } from "../types";
import { ItemModel } from "../models/ItemModel";
import { useFilterOptions } from "../composables/useFilterOptions";
import { useDebounce } from "../composables/useDebounce";

const props = defineProps<{
  filters: FilterOptions;
  sortValue: string;
  perPage: number | "all";
  allItems: ItemModel[];
}>();

const emit = defineEmits<{
  (e: "update:filters", value: FilterOptions): void;
  (e: "update:sortValue", value: string): void;
  (e: "update:perPage", value: number | "all"): void;
  (e: "filter-change"): void;
  (e: "sort-change"): void;
  (e: "per-page-change", value: number | "all"): void;
}>();

// 使用组合函数管理筛选器选项
const {
  categories,
  versions,
  sources,
  sizes,
  tags,
  colors,
  series: seriesOptions,
  themes,
  styles,
  populateFilters,
} = useFilterOptions();

// 搜索框本地状态
const searchInput = ref(props.filters.searchTerm);

// 使用防抖优化搜索
const debouncedSearch = useDebounce(searchInput, 300);

// 监听防抖后的搜索词,触发筛选
watch(debouncedSearch, (newValue) => {
  if (props.filters.searchTerm !== newValue) {
    emit("update:filters", { ...props.filters, searchTerm: newValue });
    emit("filter-change");
  }
});

// 监听 props.filters.searchTerm 的外部变化
watch(
  () => props.filters.searchTerm,
  (newValue) => {
    if (searchInput.value !== newValue) {
      searchInput.value = newValue;
    }
  }
);

// 双向绑定的计算属性
const localFilters = computed({
  get: () => props.filters,
  set: (value) => {
    emit("update:filters", value);
    emit("filter-change");
  },
});

const localSort = computed({
  get: () => props.sortValue,
  set: (value) => {
    emit("update:sortValue", value);
    emit("sort-change");
  },
});

const localPerPage = computed({
  get: () => props.perPage,
  set: (value) => {
    const numValue = value === "all" ? "all" : Number(value);
    emit("update:perPage", numValue);
    emit("per-page-change", numValue);
  },
});

// 组件挂载时填充筛选器
onMounted(() => {
  populateFilters(props.allItems);
});

// 监听物品列表变化
watch(
  () => props.allItems,
  (newItems) => {
    populateFilters(newItems);
  }
);

// 清空所有筛选条件
const clearAllFilters = () => {
  const clearedFilters: FilterOptions = {
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
  };

  // 清空搜索框
  searchInput.value = "";

  // 更新筛选条件
  emit("update:filters", clearedFilters);
  emit("filter-change");
};
</script>

<template>
  <div class="controls">
    <input
      v-model="searchInput"
      type="text"
      class="search-box"
      placeholder="🔍 搜索物品名称..."
    />

    <div class="filter-section">
      <label>排序：</label>
      <select v-model="localSort">
        <option value="name-asc">名称 A-Z</option>
        <option value="name-desc">名称 Z-A</option>
        <option value="id-asc">ID从小到大</option>
        <option value="id-desc">ID从大到小</option>
      </select>

      <label>每页显示：</label>
      <select v-model="localPerPage">
        <option :value="20">20</option>
        <option :value="40">40</option>
        <option :value="60">60</option>
        <option :value="100">100</option>
        <option value="all">全部</option>
      </select>

      <label>筛选：</label>
      <select
        v-model="localFilters.ownedFilter"
        @change="emit('filter-change')"
      >
        <option :value="undefined">全部</option>
        <option :value="true">仅已拥有</option>
        <option :value="false">仅未拥有</option>
      </select>

      <label>分类：</label>
      <select v-model="localFilters.category" @change="emit('filter-change')">
        <option :value="undefined">全部</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
          {{ cat.name }}
        </option>
      </select>

      <label>版本：</label>
      <select
        v-model="localFilters.versionFilter"
        @change="emit('filter-change')"
      >
        <option :value="undefined">全部</option>
        <option v-for="ver in versions" :key="ver.value" :value="ver.value">
          {{ ver.name }}
        </option>
      </select>

      <label>尺寸：</label>
      <select v-model="localFilters.sizeFilter" @change="emit('filter-change')">
        <option :value="undefined">全部</option>
        <option v-for="size in sizes" :key="size.value" :value="size.value">
          {{ size.name }}
        </option>
      </select>

      <label>颜色：</label>
      <select
        v-model="localFilters.colorFilter"
        @change="emit('filter-change')"
      >
        <option :value="undefined">全部</option>
        <option v-for="color in colors" :key="color.value" :value="color.value">
          {{ color.name }}
        </option>
      </select>
    </div>

    <div class="filter-section">
      <label>标签：</label>
      <select v-model="localFilters.tagFilter" @change="emit('filter-change')">
        <option value="">全部</option>
        <option v-for="tag in tags" :key="tag.value" :value="tag.value">
          {{ tag.name }}
        </option>
      </select>

      <label>HHA主题：</label>
      <select
        v-model="localFilters.seriesFilter"
        @change="emit('filter-change')"
      >
        <option value="">全部</option>
        <option
          v-for="series in seriesOptions"
          :key="series.value"
          :value="series.value"
        >
          {{ series.name }}
        </option>
      </select>

      <label>服饰主题：</label>
      <select
        v-model="localFilters.themeFilter"
        @change="emit('filter-change')"
      >
        <option value="">全部</option>
        <option v-for="theme in themes" :key="theme.value" :value="theme.value">
          {{ theme.name }}
        </option>
      </select>

      <label>服饰风格：</label>
      <select
        v-model="localFilters.styleFilter"
        @change="emit('filter-change')"
      >
        <option value="">全部</option>
        <option v-for="style in styles" :key="style.value" :value="style.value">
          {{ style.name }}
        </option>
      </select>

      <label>来源：</label>
      <select
        v-model="localFilters.sourceFilter"
        @change="emit('filter-change')"
      >
        <option value="">全部</option>
        <option
          v-for="source in sources"
          :key="source.value"
          :value="source.value"
        >
          {{ source.name }}
        </option>
      </select>

      <button class="action-btn danger" @click="clearAllFilters">
        清空筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
@import "../styles/button-styles.css";

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.search-box {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
  box-sizing: border-box;
}

.search-box:focus {
  outline: none;
  border-color: #4a9b4f;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

label {
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

select:focus {
  outline: none;
  border-color: #4a9b4f;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  select {
    width: 100%;
  }
}
</style>
