<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useItemsFilter } from '../composables/useItemsFilter';
import { DATA_LOADING } from '../constants';
import FilterControls from '../components/FilterControls.vue';
import ItemsGrid from '../components/ItemsGrid.vue';
import Pagination from '../components/Pagination.vue';
import CatalogUploader from '../components/CatalogUploader.vue';

// 使用数据加载组合函数
const { allItems, loading, error, loadData, updateCatalogData } = useItemsData();

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

// 处理目录文件上传
const handleCatalogUpload = (data: { items: Array<{ label: string; unique_id: string }> }) => {
  updateCatalogData(data);
};
</script>

<template>
  <div class="items-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.ITEMS }}</div>
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

      <div class="stats">
        <div class="stats-content">
          <div class="stat-item">总物品数: <strong>{{ allItems.length.toLocaleString() }}</strong></div>
          <div class="stat-item">当前显示: <strong>{{ filteredItems.length.toLocaleString() }}</strong></div>
          <div class="stat-item">已拥有: <strong>{{ ownedItemsCount.toLocaleString() }}</strong></div>
        </div>
        <CatalogUploader @catalog-uploaded="handleCatalogUpload" />
      </div>

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

.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stats-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
}

.stat-item {
  font-size: 1.1em;
  color: #4a9b4f;
  font-weight: 600;
  margin: 0;
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
