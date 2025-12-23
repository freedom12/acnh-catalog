<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useItemsFilter } from '../composables/useItemsFilter';
import FilterControls from '../components/FilterControls.vue';
import ItemsGrid from '../components/ItemsGrid.vue';
import Pagination from '../components/Pagination.vue';
import StatsDisplay from '../components/StatsDisplay.vue';

// 使用数据加载组合函数
const { allItems, loading, error, loadData } = useItemsData();

// 使用筛选和分页组合函数
const {
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
} = useItemsFilter(allItems);

// 计算拥有的物品数量
const ownedItemsCount = computed(() => 
  allItems.value.filter(item => item.owned).length
);

// 监听数据加载完成，初始化筛选列表
watch(allItems, (newItems) => {
  if (newItems.length > 0) {
    filteredItems.value = [...newItems];
  }
});

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="items-tab">
    <div v-if="loading" class="loading">正在加载物品数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <FilterControls
        v-model:filters="filters"
        v-model:sortValue="sortValue"
        v-model:perPage="itemsPerPage"
        :all-items="allItems"
        @filter-change="handleFilterChange"
        @sort-change="handleSortChange"
        @per-page-change="handlePerPageChange"
      />

      <StatsDisplay
        :total-items="allItems.length"
        :displayed-items="filteredItems.length"
        :owned-items="ownedItemsCount"
      />

      <ItemsGrid :items="itemsToDisplay" :color-filter="filters.colorFilter" />

      <Pagination
        v-if="totalPages > 1 || itemsPerPage !== filteredItems.length"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredItems.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
.items-tab {
  width: 100%;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}
</style>
