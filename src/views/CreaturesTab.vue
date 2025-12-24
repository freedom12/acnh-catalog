<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useCreaturesData } from '../composables/useCreaturesData';
import { DATA_LOADING, UI_TEXT } from '../constants';
import Grid from '../components/Grid.vue';
import CreatureCard from '../components/CreatureCard.vue';

// 使用生物数据加载组合函数
const { allCreatures, loading, error, loadData } = useCreaturesData();

// 当前选择的分类
const selectedCategory = ref<string>('all');

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<'north' | 'south'>('north');

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
        <div class="hemisphere-toggle">
          <button 
            class="hemisphere-btn"
            :class="{ active: selectedHemisphere === 'north' }"
            @click="selectedHemisphere = 'north'"
          >
            🌍 北
          </button>
          <button 
            class="hemisphere-btn"
            :class="{ active: selectedHemisphere === 'south' }"
            @click="selectedHemisphere = 'south'"
          >
            🌏 南
          </button>
        </div>
      </div>
      <Grid :datas="filteredCreatures" :card-component="CreatureCard" :card-props="{ hemisphere: selectedHemisphere }" />
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
  position: relative;
  justify-content: center;
}

.hemisphere-toggle {
  display: inline-flex;
  gap: 0;
  position: absolute;
  right: 0;
  background: #e0e0e0;
  border-radius: 25px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .category-filter {
    gap: 8px;
  }

  .category-btn {
    padding: 10px 16px;
    font-size: 0.9em;
  }

  .category-icon {
    font-size: 1.2em;
  }
}
</style>
