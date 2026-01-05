<script setup lang="ts">
import { onMounted } from "vue";
import { useReactionsData } from "../composables/useReactionsData";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ReactionCard from "../components/ReactionCard.vue";
import FilterSection from "../components/FilterSection.vue";

const { allReactions, loading, error, loadData } = useReactionsData();
const { filteredData, handleFiltersChanged } = useFilter(allReactions);

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.REACTIONS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredData.length
            }}{{ UI_TEXT.STATS.REACTIONS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="filteredData" :card-component="ReactionCard" />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
