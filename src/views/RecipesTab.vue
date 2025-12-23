<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRecipesData } from '../composables/useRecipesData';
import { useItemsData } from '../composables/useItemsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import RecipesGrid from '../components/RecipesGrid.vue';
import Pagination from '../components/Pagination.vue';

// 使用DIY配方数据加载组合函数
const { allRecipes, loading, error, loadData } = useRecipesData();

// 加载物品数据以便查找材料
const { loadData: loadItemsData } = useItemsData();

// 分页相关
const itemsPerPage = ref(20);
const currentPage = ref(1);

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(allRecipes.value.length / itemsPerPage.value);
});

// 当前页显示的配方
const recipesToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return allRecipes.value.slice(start, end);
});

// 处理翻页
const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
  loadItemsData();
});
</script>

<template>
  <div class="recipes-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.RECIPES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allRecipes.length }} 个配方</p>
      </div>
      <RecipesGrid :recipes="recipesToDisplay" />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="allRecipes.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
.recipes-tab {
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

.stats {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-item {
  font-size: 1.1em;
  color: #4caf50;
  font-weight: 600;
  margin: 0;
}
</style>
