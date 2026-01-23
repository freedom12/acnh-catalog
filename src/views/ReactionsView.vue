<script setup lang="ts">
import { computed } from 'vue';
import { useReactionsData } from '../composables/useReactionsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import ReactionCard from '../components/ReactionCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { data: allReactions, status, error, loadData } = useReactionsData();
const loading = computed(() => status.value === 'loading');
const { filteredData, handleFiltersChanged } = useFilter(allReactions);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="ReactionCard"
    selection-key="reactions"
  >
    <template #filters>
      <FilterSection
        :total-count="allReactions.length"
        :current-count="filteredData.length"
        selection-key="reactions"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
