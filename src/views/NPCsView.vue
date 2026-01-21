<script setup lang="ts">
import { useNPCsData } from '../composables/useNPCsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import NPCCard from '../components/NPCCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { useItemsData } from '../composables';

const { loadData: loadItems } = useItemsData();
const { allNPCs, loading, error, loadData: loadNPCs } = useNPCsData();
const { filteredData, handleFiltersChanged } = useFilter(allNPCs);
function onLoad() {
  loadNPCs();
  loadItems();
}
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="onLoad"
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
