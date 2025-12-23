<script setup lang="ts">
import { onMounted } from 'vue';
import { useVillagersData } from '../composables/useVillagersData';
import VillagersGrid from '../components/VillagersGrid.vue';

// 使用村民数据加载组合函数
const { allVillagers, loading, error, loadData } = useVillagersData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="villagers-tab">
    <div v-if="loading" class="loading">正在加载村民数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">共 {{ allVillagers.length }} 位村民</p>
      </div>
      <VillagersGrid :villagers="allVillagers" />
    </template>
  </div>
</template>

<style scoped>
.villagers-tab {
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
  color: #4a9b4f;
  font-weight: 600;
  margin: 0;
}
</style>
