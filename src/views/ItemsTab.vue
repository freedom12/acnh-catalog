<script setup lang="ts">
import { onMounted, watch, computed, ref } from "vue";
import { useItemsData } from "../composables/useItemsData";
import { useItemsFilter } from "../composables/useItemsFilter";
import { DATA_LOADING } from "../constants";
import ItemFilterControls from "../components/ItemFilterControls.vue";
import Grid from "../components/Grid.vue";
import ItemCard from "../components/ItemCard.vue";
import Pagination from "../components/Pagination.vue";
import CatalogUploader from "../components/CatalogUploader.vue";

// 使用数据加载组合函数
const { allItems, loading, error, loadData, updateCatalogData } =
  useItemsData();

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
  handlePerPageChange,
} = useItemsFilter(allItems);

// 计算拥有的物品数量
const ownedItemsCount = computed(
  () => allItems.value.filter((item) => item.owned).length
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
const handleCatalogUpload = (data: {
  items: Array<{ label: string; unique_id: number }>;
}) => {
  updateCatalogData(data);
};

// 控制筛选器的展开/收纳状态
const isFilterExpanded = ref(false);

const toggleFilter = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.ITEMS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <div
        class="filter-section"
        :class="{ 'filter-expanded': isFilterExpanded }"
      >
        <div class="stats stats-layout-flex">
          <div class="stats-content">
            <div class="stat-item">
              总物品数: <strong>{{ allItems.length.toLocaleString() }}</strong>
            </div>
            <div class="stat-item">
              当前显示:
              <strong>{{ filteredItems.length.toLocaleString() }}</strong>
            </div>
            <div class="stat-item">
              已拥有: <strong>{{ ownedItemsCount.toLocaleString() }}</strong>
            </div>
          </div>
          <div class="action-buttons">
            <button class="action-btn primary" @click="toggleFilter">
              <span>{{ isFilterExpanded ? "收起筛选" : "展开筛选" }}</span>
              <span class="icon">{{ isFilterExpanded ? "▲" : "▼" }}</span>
            </button>
            <CatalogUploader @catalog-uploaded="handleCatalogUpload" />
          </div>
        </div>

        <div v-if="isFilterExpanded" class="filter-controls-wrapper">
          <ItemFilterControls
            v-model:filters="filters"
            v-model:sortValue="sortValue"
            v-model:perPage="itemsPerPage"
            :all-items="allItems"
            @filter-change="handleFilterChange"
            @sort-change="handleSortChange"
            @per-page-change="handlePerPageChange"
          />
        </div>
      </div>

      <Grid
        :datas="itemsToDisplay"
        :card-component="ItemCard"
        :card-props="{ colorFilter: filters.colorFilter }"
      />

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
@import "../styles/tab-styles.css";
@import "../styles/button-styles.css";

.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
