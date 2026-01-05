<script setup lang="ts">
import { computed } from "vue";
import { useConstructionData } from "../composables/useConstructionData";
import { useFilter } from "../composables/useFilter";
import DataView from "../components/DataView.vue";
import ConstructionCard from "../components/ConstructionCard.vue";
import FilterSection from "../components/FilterSection.vue";
import { ConstructionType } from "../types/construction";
import { getConstrunctionTypeName } from "../services/dataService";

const { allConstruction, loading, error, loadData } = useConstructionData();
const filters = computed(() => [
  {
    label: "类型",
    value: "type",
    options: Object.values(ConstructionType).map((type) => ({
      value: type,
      label: `${getConstrunctionTypeName(type)} (${
        allConstruction.value.filter((item) => item.type === type).length
      })`,
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allConstruction);
const sortedFilteredData = computed(() => {
  return filteredData.value.sort((a: any, b: any) => a.id - b.id);
});
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="loadData" :datas="sortedFilteredData" :per-page="100" :card-component="ConstructionCard">
    <template #filters>
      <FilterSection 
        :filters="filters" 
        :total-count="allConstruction.length" 
        :current-count="sortedFilteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
