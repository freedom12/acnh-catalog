<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useVillagersData } from "../composables/useVillagersData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import VillagerCard from "../components/VillagerCard.vue";
import FilterSection from "../components/FilterSection.vue";
import Pagination from "../components/Pagination.vue";
import { Gender, Hobby, Personality, Species } from "../types/villager";
import {
  getGenderName,
  getHobbyName,
  getPersonalityName,
  getSpeciesName,
} from "../services/dataService";

const { allVillagers, loading, error, loadData } = useVillagersData();
const filters = computed(() => [
  {
    label: "种族",
    value: "species",
    options: Object.values(Species).map((species) => ({
      value: species,
      label: getSpeciesName(species),
    })),
  },
  {
    label: "性别",
    value: "gender",
    options: Object.values(Gender).map((gender) => ({
      value: gender,
      label: getGenderName(gender),
    })),
  },
  {
    label: "性格",
    value: "personality",
    options: Object.values(Personality).map((personality) => ({
      value: personality,
      label: getPersonalityName(personality),
    })),
  },
  {
    label: "爱好",
    value: "hobby",
    options: Object.values(Hobby).map((hobby) => ({
      value: hobby,
      label: getHobbyName(hobby),
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allVillagers);
const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } =
  usePagination(filteredData, perPageCount);

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.VILLAGERS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection :filters="filters" @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS
            }}{{ filteredData.length.toLocaleString()
            }}{{ UI_TEXT.STATS.VILLAGERS_UNIT }}
          </div>
        </template>
      </FilterSection>
      <Grid :datas="displayDatas" :card-component="VillagerCard" />
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
