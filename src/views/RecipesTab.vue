<script setup lang="ts">
import { onMounted } from 'vue';
import { useRecipesData } from '../composables/useRecipesData';
import { useItemsData } from '../composables/useItemsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import RecipesGrid from '../components/RecipesGrid.vue';

// 使用DIY配方数据加载组合函数
const { allRecipes, loading, error, loadData } = useRecipesData();

// 加载物品数据以便查找材料
const { loadData: loadItemsData } = useItemsData();

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
      <RecipesGrid :recipes="allRecipes" />
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
