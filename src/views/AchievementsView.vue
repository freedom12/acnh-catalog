<script setup lang="ts">
import { useAchievementsData } from '../composables/useAchievementsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import AchievementCard from '../components/AchievementCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { allAchievements, loading, error, loadData } = useAchievementsData();
const { filteredData, handleFiltersChanged } = useFilter(allAchievements);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="AchievementCard"
  >
    <template #filters>
      <FilterSection
        :total-count="allAchievements.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>

<style scoped>
:deep(.generic-grid) {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>