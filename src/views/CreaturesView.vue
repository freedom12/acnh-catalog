<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useCreaturesData } from "../composables/useCreaturesData";
import { useFilter } from "../composables/useFilter";
import DataView from "../components/DataView.vue";
import CreatureCard from "../components/CreatureCard.vue";
import FilterSection from "../components/FilterSection.vue";
import ToggleGroup from "../components/ToggleGroup.vue";
import { CreatureType } from "../types";
import { getCreatureTypeName } from "../services/dataService";

const { allCreatures, loading, error, loadData } = useCreaturesData();

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<"north" | "south">(
  (localStorage.getItem("hemisphere") as "north" | "south") || "north"
);
const hemisphereOptions = [
  { value: "north", label: "北", icon: "🌍" },
  { value: "south", label: "南", icon: "🌏" },
];

watch(selectedHemisphere, (newHemisphere) => {
  localStorage.setItem("hemisphere", newHemisphere);
});
const filters = computed(() => [
  {
    label: "类别",
    value: "type",
    options: Object.values(CreatureType).map((type) => ({
      value: type,
      label: `${getCreatureTypeName(type)} (${
        allCreatures.value.filter((r) => r.type === type).length
      })`,
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allCreatures);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="CreatureCard"
    :card-props="{ hemisphere: selectedHemisphere }"
  >
    <template #filters>
      <FilterSection
        :filters="filters"
        :total-count="allCreatures.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      >
        <template #action-buttons>
          <ToggleGroup
            v-model="selectedHemisphere"
            :options="hemisphereOptions"
          />
        </template>
      </FilterSection>
    </template>
  </DataView>
</template>
