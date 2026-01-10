<script setup lang="ts">
import DataView from '../components/DataView.vue';
import PlantCard from '../components/PlantCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { usePlantsData } from '../composables/usePlantsData';
import { useFilter } from '../composables/useFilter';

const { allPlants, loading, error, loadData } = usePlantsData();
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
        :total-count="allPlants.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
