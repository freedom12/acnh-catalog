<script setup lang="ts">
import { useMusicData } from '../composables/useMusicData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import MusicCard from '../components/MusicCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { allMusic, loading, error, loadData } = useMusicData();
const { filteredData, handleFiltersChanged } = useFilter(allMusic);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="MusicCard"
  >
    <template #filters>
      <FilterSection
        :total-count="allMusic.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
