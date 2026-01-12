<script setup lang="ts">
import { computed } from 'vue';
import { useConstructionData } from '../composables/useConstructionData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import ConstructionCard from '../components/ConstructionCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { ConstructionType } from '../types/construction';
import { getConstructionTypeName } from '../services/dataService';

const { allConstruction, loading, error, loadData } = useConstructionData();
const filters = computed(() => [
  {
    label: '分类',
    value: 'type',
    options: Object.values(ConstructionType).map((type) => ({
      value: type,
      label: `${getConstructionTypeName(type)} (${
        allConstruction.value.filter((item) => item.type === type).length
      })`,
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allConstruction);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="ConstructionCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allConstruction.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
