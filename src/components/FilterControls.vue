<script setup lang="ts">
import { watch, computed, onMounted } from 'vue';
import type { Item, FilterOptions } from '../types';
import { getCategoryName, getSourceName, getColorName, getTagName } from '../services/dataService';
import { useFilterOptions } from '../composables/useFilterOptions';

const props = defineProps<{
  filters: FilterOptions;
  sortValue: string;
  perPage: number | 'all';
  allItems: Item[];
}>();

const emit = defineEmits<{
  (e: 'update:filters', value: FilterOptions): void;
  (e: 'update:sortValue', value: string): void;
  (e: 'update:perPage', value: number | 'all'): void;
  (e: 'filter-change'): void;
  (e: 'sort-change'): void;
  (e: 'per-page-change', value: number | 'all'): void;
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
  populateFilters
} = useFilterOptions();

// 双向绑定的计算属性
const localFilters = computed({
  get: () => props.filters,
  set: (value) => {
    emit('update:filters', value);
    emit('filter-change');
  }
});

const localSort = computed({
  get: () => props.sortValue,
  set: (value) => {
    emit('update:sortValue', value);
    emit('sort-change');
  }
});

const localPerPage = computed({
  get: () => props.perPage,
  set: (value) => {
    const numValue = value === 'all' ? 'all' : Number(value);
    emit('update:perPage', numValue);
    emit('per-page-change', numValue);
  }
});

// 组件挂载时填充筛选器
onMounted(() => {
  populateFilters(props.allItems);
});

// 监听物品列表变化
watch(() => props.allItems, (newItems) => {
  populateFilters(newItems);
});
</script>

<template>
  <div class="controls">
    <input
      v-model="localFilters.searchTerm"
      type="text"
      class="search-box"
      placeholder="🔍 搜索物品名称..."
      @input="emit('filter-change')"
    >

    <div class="filter-section">
      <label>分类：</label>
      <select v-model="localFilters.category" @change="emit('filter-change')">
        <option value="">全部分类</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ getCategoryName(cat) }}
        </option>
      </select>

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
      <select v-model="localFilters.ownedFilter" @change="emit('filter-change')">
        <option value="all">全部物品</option>
        <option value="owned">仅已拥有</option>
        <option value="not-owned">仅未拥有</option>
      </select>

      <label>版本：</label>
      <select v-model="localFilters.versionFilter" @change="emit('filter-change')">
        <option value="">全部版本</option>
        <option v-for="ver in versions" :key="ver" :value="ver">{{ ver }}</option>
      </select>

      <label>尺寸：</label>
      <select v-model="localFilters.sizeFilter" @change="emit('filter-change')">
        <option value="">全部尺寸</option>
        <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>

    <div class="filter-section">
      <label>颜色：</label>
      <select v-model="localFilters.colorFilter" @change="emit('filter-change')">
        <option value="">全部颜色</option>
        <option v-for="color in colors" :key="color" :value="color">
          {{ getColorName(color) }}
        </option>
      </select>

      <label>标签：</label>
      <select v-model="localFilters.tagFilter" @change="emit('filter-change')">
        <option value="">全部标签</option>
        <option v-for="tag in tags" :key="tag" :value="tag">
          {{ getTagName(tag) }}
        </option>
      </select>

      <label>系列：</label>
      <select v-model="localFilters.seriesFilter" @change="emit('filter-change')">
        <option value="">全部系列</option>
        <option v-for="series in seriesOptions" :key="series.value" :value="series.value">
          {{ series.name }}
        </option>
      </select>

      <label>来源：</label>
      <select v-model="localFilters.sourceFilter" @change="emit('filter-change')">
        <option value="">全部来源</option>
        <option v-for="source in sources" :key="source" :value="source">
          {{ getSourceName(source) }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.controls {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
