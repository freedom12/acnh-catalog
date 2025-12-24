<script setup lang="ts">
import { onMounted } from 'vue';
import { useReactionsData } from '../composables/useReactionsData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import Grid from '../components/Grid.vue';
import ReactionCard from '../components/ReactionCard.vue';

// 使用表情反应数据加载组合函数
const { allReactions, loading, error, loadData } = useReactionsData();

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.REACTIONS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allReactions.length }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}</p>
      </div>
      <Grid :datas="allReactions" :card-component="ReactionCard" />
    </template>
  </div>
</template>

<style scoped>
@import '../styles/tab-styles.css';
</style>
