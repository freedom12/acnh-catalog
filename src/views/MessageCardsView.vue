<script setup lang="ts">
import { computed } from 'vue';
import { useMessageCardsData } from '../composables/useMessageCardsData';
import { useFilter } from '../composables/useFilter';
import DataView from '../components/DataView.vue';
import MessageCard from '../components/MessageCard.vue';
import FilterSection from '../components/FilterSection.vue';

const { data: allMessageCards, status, error, loadData } = useMessageCardsData();
const loading = computed(() => status.value === 'loading');
const { filteredData, handleFiltersChanged } = useFilter(allMessageCards);
</script>

<template>
  <DataView
    :loading="loading"
    :error="error"
    :on-load="loadData"
    :datas="filteredData"
    :card-component="MessageCard"
  >
    <template #filters>
      <FilterSection
        :total-count="allMessageCards.length"
        :current-count="filteredData.length"
        @filters-changed="handleFiltersChanged"
      />
    </template>
  </DataView>
</template>
