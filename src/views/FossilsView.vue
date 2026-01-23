<script setup lang="ts">
import { computed } from 'vue';
import { useFossilsData } from '../composables/useFossilsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import FossilCard from '../components/FossilCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { data: allFossils, status, error, loadData } = useFossilsData();
const loading = computed(() => status.value === 'loading');
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
    selection-key="fossils"
  >
    <template #filters>
      <FilterSection
        :total-count="allFossils.length"
        :current-count="filteredData.length"
        selection-key="fossils"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
