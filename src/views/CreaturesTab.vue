<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useCreaturesData } from "../composables/useCreaturesData";
import { usePagination } from "../composables/usePagination";
import { useFilter } from "../composables/useFilter";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import CreatureCard from "../components/CreatureCard.vue";
import ToggleGroup from "../components/ToggleGroup.vue";
import Pagination from "../components/Pagination.vue";
import FilterSection from "../components/FilterSection.vue";
import { CreatureType } from "../types";
import { getCreatureTypeName } from "../services/dataService";

const { allCreatures, loading, error, loadData } = useCreaturesData();

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<"north" | "south">("north");
const hemisphereOptions = [
  { value: "north", label: "北", icon: "🌍" },
  { value: "south", label: "南", icon: "🌏" },
];

const filters = computed(() => [
  {
    label: "类别",
    value: "type",
    options: Object.values(CreatureType).map((type) => ({
      value: type,
      label: `${getCreatureTypeName(type)} (${
        allCreatures.value.filter((r) => r.type === type).length
      })`,
    })),
  },
]);
const { filteredData, handleFiltersChanged } = useFilter(allCreatures);
// 监听分类变化，切换时回到第一页
const sortedFilteredData = computed(() => {
  currentPage.value = 1;
  return filteredData.value.sort((a, b) => {
    const diff = a.type - b.type;
    if (diff !== 0) return diff;
    return a.order - b.order;
  });
});

const perPageCount = ref(100);
const { currentPage, totalPageCount, displayDatas, handlePageChange } =
  usePagination(sortedFilteredData, perPageCount);

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CREATURES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <FilterSection :filters="filters" @filters-changed="handleFiltersChanged">
        <template #stats>
          <div class="stat-item">
            {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ sortedFilteredData.length
            }}{{ UI_TEXT.STATS.CREATURES_UNIT }}
          </div>
        </template>
        <template #action-buttons>
          <ToggleGroup
            v-model="selectedHemisphere"
            :options="hemisphereOptions"
          />
        </template>
      </FilterSection>
      <Grid
        :datas="displayDatas"
        :card-component="CreatureCard"
        :card-props="{ hemisphere: selectedHemisphere }"
      />
      <Pagination
        v-if="totalPageCount > 1"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :items-count="sortedFilteredData.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
