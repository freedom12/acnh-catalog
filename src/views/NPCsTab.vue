<script setup lang="ts">
import { onMounted } from 'vue';
import { useNPCsData } from '../composables/useNPCsData';
import NPCsGrid from '../components/NPCsGrid.vue';

// 使用NPC数据加载组合函数
const { allNPCs, loading, error, loadData } = useNPCsData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="npcs-tab">
    <div v-if="loading" class="loading">正在加载NPC数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">共 {{ allNPCs.length }} 位NPC</p>
      </div>
      <NPCsGrid :npcs="allNPCs" />
    </template>
  </div>
</template>

<style scoped>
.npcs-tab {
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
  color: #e67e22;
  font-weight: 600;
  margin: 0;
}
</style>
