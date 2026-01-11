<script setup lang="ts">
import { computed } from 'vue';
import DataView from '../components/DataView.vue';
import PlantCard from '../components/PlantCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { usePlantsData } from '../composables/usePlantsData';
import { useFilter } from '../composables/useFilter';
import { PlantType } from '../types/plant';
import { getPlantTypeName } from '../services/dataService';

const { allPlants, loading, error, loadData } = usePlantsData();

const filters = computed(() => [
  {
    label: '类型',
    value: 'type',
    options: Object.values(PlantType).map((type) => ({
      value: type,
      label: `${getPlantTypeName(type)} (${allPlants.value.filter((p) => p.type === type).length})`,
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
