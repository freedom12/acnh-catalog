<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useCreaturesData } from '../composables/useCreaturesData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import Grid from '../components/Grid.vue';
import CreatureCard from '../components/CreatureCard.vue';
import ToggleGroup from '../components/ToggleGroup.vue';
import Pagination from '../components/Pagination.vue';

// 使用生物数据加载组合函数
const { allCreatures, loading, error, loadData } = useCreaturesData();

// 当前选择的分类
const selectedCategory = ref<string>('all');

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<'north' | 'south'>('north');

// 半球切换选项
const hemisphereOptions = [
  { value: 'north', label: '北', icon: '🌍' },
  { value: 'south', label: '南', icon: '🌏' }
];

// 分类选项
type CategoryValue = 'all' | 'Insects' | 'Fish' | 'Sea Creatures';

const categories: Array<{ value: CategoryValue; label: string; icon: string }> = [
  { value: 'all', label: '全部', icon: '🌍' },
  { value: 'Insects', label: '昆虫', icon: '🦋' },
  { value: 'Fish', label: '鱼类', icon: '🐟' },
  { value: 'Sea Creatures', label: '海洋生物', icon: '🦀' }
];

// 根据分类筛选的生物
const filteredCreatures = computed(() => {
  let result = selectedCategory.value === 'all' 
    ? [...allCreatures.value]
    : allCreatures.value.filter(creature => creature.sourceSheet === selectedCategory.value);
  
  // 排序
  if (selectedCategory.value === 'all') {
    // 全部：先按类别排序，再按num排序
    const categoryOrder: Record<string, number> = {
      'Insects': 1,
      'Fish': 2,
      'Sea Creatures': 3
    };
    return result.sort((a, b) => {
      const categoryDiff = (categoryOrder[a.sourceSheet] || 999) - (categoryOrder[b.sourceSheet] || 999);
      if (categoryDiff !== 0) return categoryDiff;
      return a.num - b.num;
    });
  } else {
    // 特定分类：仅按num排序
    return result.sort((a, b) => a.num - b.num);
  }
});

// 各分类的数量统计
const categoryStats = computed(() => {
  const stats: Record<CategoryValue, number> = {
    all: allCreatures.value.length,
    Insects: 0,
    Fish: 0,
    'Sea Creatures': 0
  };
  
  allCreatures.value.forEach(creature => {
    if (creature.sourceSheet === 'Insects') stats.Insects++;
    else if (creature.sourceSheet === 'Fish') stats.Fish++;
    else if (creature.sourceSheet === 'Sea Creatures') stats['Sea Creatures']++;
  });
  
  return stats;
});

// 分页相关
const itemsPerPage = ref(100);
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(filteredCreatures.value.length / itemsPerPage.value);
});
const creaturesToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCreatures.value.slice(start, end);
});
const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CREATURES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <template v-else>
      <div class="stats">
        <p class="stat-item">{{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredCreatures.length }}{{ UI_TEXT.STATS.CREATURES_UNIT }}</p>
      </div>
      <div class="filter-row">
        <div class="category-filter">
          <button v-for="category in categories" :key="category.value" class="category-btn"
            :class="{ active: selectedCategory === category.value }" @click="selectedCategory = category.value">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-label">{{ category.label }}</span>
            <span class="category-count">({{ categoryStats[category.value] }})</span>
          </button>
        </div>
        <div class="toggle-group">
          <ToggleGroup
            v-model="selectedHemisphere"
            :options="hemisphereOptions"
          />
        </div>
      </div>
      <Grid :datas="creaturesToDisplay" :card-component="CreatureCard" :card-props="{ hemisphere: selectedHemisphere }" />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredCreatures.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import '../styles/tab-styles.css';

.filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.category-filter {
  display: flex;
  justify-content: center;
  flex: 1;
}
</style>
