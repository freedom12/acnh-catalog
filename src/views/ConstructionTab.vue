<script setup lang="ts">
import { onMounted } from 'vue';
import { useConstructionData } from '../composables/useConstructionData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import ConstructionGrid from '../components/ConstructionGrid.vue';

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="construction-tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CONSTRUCTION }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allConstruction.length }} 个改建项目</p>
      </div>
      <ConstructionGrid :construction="allConstruction" />
    </template>
  </div>
</template>

<style scoped>
.construction-tab {
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
