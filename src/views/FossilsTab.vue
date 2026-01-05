<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFossilsData } from "../composables/useFossilsData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import FossilCard from "../components/FossilCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";

const { allFossils, loading, error, loadData } = useFossilsData();
const { filteredData, handleFiltersChanged } = useFilter(allFossils);
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } =
  usePagination(filteredData, perPageCount);

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.FOSSILS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.FOSSILS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="FossilCard" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="filteredData.length"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
