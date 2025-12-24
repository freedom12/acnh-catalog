<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRecipesData } from '../composables/useRecipesData';
import { useItemsData } from '../composables/useItemsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import Grid from '../components/Grid.vue';
import RecipeCard from '../components/RecipeCard.vue';
import Pagination from '../components/Pagination.vue';

// 使用DIY配方数据加载组合函数
const { allRecipes, loading, error, loadData } = useRecipesData();

// 加载物品数据以便查找材料
const { loadData: loadItemsData } = useItemsData();


// 分类筛选
const selectedCategory = ref('all');
const categories = computed(() => {
  const set = new Set<string>();
  allRecipes.value.forEach(r => r.category && set.add(r.category));
  return ['all', ...Array.from(set)];
});
const filteredRecipes = computed(() => {
  if (selectedCategory.value === 'all') return allRecipes.value;
  return allRecipes.value.filter(r => r.category === selectedCategory.value);
});

// 分页相关
const itemsPerPage = ref(20);
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / itemsPerPage.value);
});
const recipesToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredRecipes.value.slice(start, end);
});
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
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.RECIPES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredRecipes.length }} 个配方</p>
      </div>
      <div class="category-filter">
        <button v-for="cat in categories" :key="cat" class="category-btn"
          :class="{ active: selectedCategory === cat }" @click="selectedCategory = cat">
          <span class="category-label">{{ cat === 'all' ? '全部' : cat }}</span>
          <span class="category-count">({{ cat === 'all' ? allRecipes.length : allRecipes.filter(r => r.category === cat).length }})</span>
        </button>
      </div>
      <Grid :datas="recipesToDisplay" :card-component="RecipeCard" />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredRecipes.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import '../styles/tab-styles.css';
</style>
