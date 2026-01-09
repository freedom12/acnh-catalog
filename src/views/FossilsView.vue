<script setup lang="ts">
import { useFossilsData } from '../composables/useFossilsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import FossilCard from '../components/FossilCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { allFossils, loading, error, loadData } = useFossilsData();
const { filteredData, handleFiltersChanged } = useFilter(allFossils);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="FossilCard"
  >
    <template #filters>
      <FilterSection
        :total-count="allFossils.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
