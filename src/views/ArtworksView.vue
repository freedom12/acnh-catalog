<script setup lang="ts">
import { useArtworkData } from '../composables/useArtworkData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import ArtworkCard from '../components/ArtworkCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { allArtwork, loading, error, loadData } = useArtworkData();
const { filteredData, handleFiltersChanged } = useFilter(allArtwork);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :per-page="100"
    :card-component="ArtworkCard"
    selection-key="artworks"
  >
    <template #filters>
      <FilterSection
        :total-count="allArtwork.length"
        :current-count="filteredData.length"
        selection-key="artworks"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
