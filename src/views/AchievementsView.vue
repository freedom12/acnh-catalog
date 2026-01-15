<script setup lang="ts">
import { computed } from 'vue';
import { useAchievementsData } from '../composables/useAchievementsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import FilterSection, { type Filter } from '../components/FilterSection.vue';
import AchievementCard from '../components/AchievementCard.vue';
import { getVersionName } from '../services/dataService';
import { Version } from '../types/item';

const { allAchievements, loading, error, loadData } = useAchievementsData();
const { filteredData, handleFiltersChanged } = useFilter(allAchievements);

const filters = computed<Filter[]>(() => {
  // 类型选项
  const typeOptions = [
    { value: 'Communication', label: '交流' },
    { value: 'Cooking', label: '烹饪' },
    { value: 'DIY', label: 'DIY' },
    { value: 'Event', label: '事件' },
    { value: 'Fish', label: '钓鱼' },
    { value: 'HHA', label: 'HHA' },
    { value: 'Insect', label: '昆虫' },
    { value: 'LandMaking', label: '建造' },
    { value: 'Money', label: '铃钱' },
    { value: 'MyDesign', label: '我的设计' },
    { value: 'Negative', label: '负面' },
    { value: 'Plant', label: '植物' },
    { value: 'Seafood', label: '海鲜' },
    { value: 'Smartphone', label: '手机' },
    { value: 'Vegetable', label: '蔬菜' },
  ];

  // 版本选项
  const versionsOptions = Object.values(Version).map((version) => ({
    value: version,
    label: getVersionName(version),
  }));

  return [
    {
      label: '类型',
      value: 'type',
      options: typeOptions,
    },
    {
      label: '版本',
      value: 'ver',
      options: versionsOptions,
    },
  ];
});
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="AchievementCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allAchievements.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>

<style scoped>
:deep(.generic-grid) {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>