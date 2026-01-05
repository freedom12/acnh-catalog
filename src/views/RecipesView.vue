<script setup lang="ts">
import { computed } from "vue";
import { useRecipesData } from "../composables/useRecipesData";
import { useItemsData } from "../composables/useItemsData";
import { useFilter } from "../composables/useFilter";
import { RecipeType } from "../types/recipe";
import DataView from "../components/DataView.vue";
import RecipeCard from "../components/RecipeCard.vue";
import FilterSection from "../components/FilterSection.vue";
import { getRecipeTypeName } from "../services/dataService";

const { allRecipes, loading, error, loadData } = useRecipesData();
const { loadData: loadItemsData } = useItemsData();
const filters = computed(() => [
  {
    label: "类型",
    value: "type",
    options: Object.values(RecipeType).map((type) => ({
      value: type,
      label: `${getRecipeTypeName(type)} (${
        allRecipes.value.filter((r) => r.type === type).length
      })`,
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allRecipes);

const onLoad = () => {
  loadData();
  loadItemsData();
};
</script>

<template>
  <DataView :loading="loading" :error="error" :on-load="onLoad" :datas="filteredData" :per-page="100" :card-component="RecipeCard">
    <template #filters>
      <FilterSection 
        :filters="filters" 
        :total-count="allRecipes.length" 
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
