<script setup lang="ts">
import { onMounted } from 'vue';
import { useNPCsData } from '../composables/useNPCsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import Grid from '../components/Grid.vue';
import NPCCard from '../components/NPCCard.vue';

// 使用NPC数据加载组合函数
const { allNPCs, loading, error, loadData } = useNPCsData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.NPCS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allNPCs.length }}{{ UI_TEXT.STATS.NPCS_UNIT }}</p>
      </div>
      <Grid :datas="allNPCs" :card-component="NPCCard" />
    </template>
  </div>
</template>

<style scoped>
@import '../styles/tab-styles.css';
</style>
