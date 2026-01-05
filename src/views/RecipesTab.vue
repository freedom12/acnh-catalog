<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRecipesData } from "../composables/useRecipesData";
import { useItemsData } from "../composables/useItemsData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import { RecipeType } from "../types/recipe";
import Grid from "../components/Grid.vue";
import RecipeCard from "../components/RecipeCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";
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
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } =
  usePagination(filteredData, perPageCount);

onMounted(() => {
  loadData();
  loadItemsData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.RECIPES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection :filters="filters" @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.RECIPES_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="RecipeCard" />
      <Pagination
        v-if="totalPageCount > 1"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredData.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";

.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
