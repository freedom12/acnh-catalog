<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCreaturesData } from '../composables/useCreaturesData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import CreatureCard from '../components/CreatureCard.vue';
import FilterSection from '../components/FilterSection.vue';
import ToggleGroup from '../components/ToggleGroup.vue';
import { CreatureType, type Creature } from '../types';
import { getCreatureTypeName } from '../services/dataService';

const { data: allCreatures, status, error, loadData } = useCreaturesData();
const loading = computed(() => status.value === 'loading');

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<'north' | 'south'>(
  (localStorage.getItem('hemisphere') as 'north' | 'south') || 'north'
);
const hemisphereOptions = [
  { value: 'north', label: '北', icon: '🌍' },
  { value: 'south', label: '南', icon: '🌏' },
];

watch(selectedHemisphere, (newHemisphere) => {
  localStorage.setItem('hemisphere', newHemisphere);
});

// 当前月份
const currentMonth = new Date().getMonth() + 1;

// 当前小时（0-23）
const currentHour = new Date().getHours();

const filters = computed(() => [
  {
    label: '类别',
    value: 'type',
    options: Object.values(CreatureType).map((type) => ({
      value: type,
      label: `${getCreatureTypeName(type)} (${
        allCreatures.value.filter((r: Creature) => r.type === type).length
      })`,
    })),
  },
  {
    label: '可捕捉',
    value: 'availability',
    options: [
      { value: 'currentMonth', label: '当前月份' },
      { value: 'currentTime', label: '当前时间' },
    ],
  },
]);

const customFilterFn = (
  creature: any,
  _searchQuery: string,
  selectedFilters: Record<string, any>
) => {
  if (selectedFilters.availability === 'currentMonth') {
    const hemisphere = creature.hemispheres[selectedHemisphere.value];
    return hemisphere.months.includes(currentMonth);
  }
  if (selectedFilters.availability === 'currentTime') {
    const hemisphere = creature.hemispheres[selectedHemisphere.value];
    return (
      hemisphere.months.includes(currentMonth) && hemisphere.hours.includes(currentHour)
    );
  }
  return true;
};

const { filteredData, handleFiltersChanged } = useFilter(allCreatures, customFilterFn);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="CreatureCard"
    :card-props="{ hemisphere: selectedHemisphere }"
    selection-key="creatures"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allCreatures.length"
        :current-count="filteredData.length"
        selection-key="creatures"
        @filters-changed="handleFiltersChanged"
      >
        <template #action-buttons>
          <ToggleGroup v-model="selectedHemisphere" :options="hemisphereOptions" />
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
