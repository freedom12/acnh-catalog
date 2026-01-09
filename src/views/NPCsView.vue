<script setup lang="ts">
import { useNPCsData } from '../composables/useNPCsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import NPCCard from '../components/NPCCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { allNPCs, loading, error, loadData } = useNPCsData();
const { filteredData, handleFiltersChanged } = useFilter(allNPCs);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="NPCCard"
  >
    <template #filters>
      <FilterSection
        :total-count="allNPCs.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
