<script setup lang="ts">
import { computed } from 'vue';
import { useNPCsData } from '../composables/useNPCsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import NPCCard from '../components/NPCCard.vue';
import FilterSection from '../components/FilterSection.vue';
import { useItemsData } from '../composables';

const { loadData: loadItems } = useItemsData();
const { data: allNPCs, status, error, loadData: loadNPCs } = useNPCsData();
const loading = computed(() => status.value === 'loading');
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
