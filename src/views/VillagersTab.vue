<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useVillagersData } from '../composables/useVillagersData';
import { DATA_LOADING } from '../constants';
import Grid from '../components/Grid.vue';
import VillagerCard from '../components/VillagerCard.vue';
import VillagerFilterControls from '../components/VillagerFilterControls.vue';

// 使用村民数据加载组合函数
const { allVillagers, loading, error, loadData } = useVillagersData();


// 多条件筛选
const filters = ref({
  species: '',
  gender: '',
  personality: '',
  hobby: ''
});
const isFilterExpanded = ref(false);

const filteredVillagers = computed(() => {
  let result = allVillagers.value;
  if (filters.value.species) {
    result = result.filter(v => v.species === filters.value.species);
  }
  if (filters.value.gender) {
    result = result.filter(v => v.gender === filters.value.gender);
  }
  if (filters.value.personality) {
    result = result.filter(v => v.personality === filters.value.personality);
  }
  if (filters.value.hobby) {
    result = result.filter(v => v.hobby === filters.value.hobby);
  }
  return result;
});

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.VILLAGERS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="filter-section" :class="{ 'filter-expanded': isFilterExpanded }">
        <div class="stats stats-layout-flex">
          <div class="stats-content">
            <div class="stat-item">总村民数: <strong>{{ allVillagers.length.toLocaleString() }}</strong></div>
            <div class="stat-item">当前显示: <strong>{{ filteredVillagers.length.toLocaleString() }}</strong></div>
          </div>
          <div class="action-buttons">
            <button class="toggle-filter-btn" @click="isFilterExpanded = !isFilterExpanded">
              <span>{{ isFilterExpanded ? '收起筛选' : '展开筛选' }}</span>
              <span class="icon">{{ isFilterExpanded ? '▲' : '▼' }}</span>
            </button>
          </div>
        </div>
        <div v-if="isFilterExpanded" class="filter-controls-wrapper">
          <VillagerFilterControls :filters="filters" :allVillagers="allVillagers" />
        </div>
      </div>
      <Grid :datas="filteredVillagers" :card-component="VillagerCard" />
    </template>
  </div>
</template>

<style scoped>
@import '../styles/tab-styles.css';

.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
