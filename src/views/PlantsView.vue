<script setup lang="ts">
import { computed } from 'vue';
import DataView from '../components/DataView.vue';
import PlantCard from '../components/PlantCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { usePlantsData } from '../composables/usePlantsData';
import { useFilter } from '../composables/useFilter';
import { PlantType, type Plant } from '../types/plant';
import { getPlantTypeName } from '../services/dataService';

const { data: allPlants, status, error, loadData } = usePlantsData();
const loading = computed(() => status.value === 'loading');

const filters = computed(() => [
  {
    label: '分类',
    value: 'type',
    options: Object.values(PlantType).map((type) => ({
      value: type,
      label: `${getPlantTypeName(type)} (${allPlants.value.filter((p: Plant) => p.type === type).length})`,
    })),
  },
]);

const { filteredData, handleFiltersChanged } = useFilter(allPlants);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="PlantCard"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allPlants.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
