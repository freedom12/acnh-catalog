<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useCreaturesData } from "../composables/useCreaturesData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import CreatureCard from "../components/CreatureCard.vue";
import ToggleGroup from "../components/ToggleGroup.vue";
import Pagination from "../components/Pagination.vue";
import { CreatureType } from "../types";
import { getCreatureTypeName } from "../services/dataService";

// 使用生物数据加载组合函数
const { allCreatures, loading, error, loadData } = useCreaturesData();

// 当前选择的半球（默认北半球）
const selectedHemisphere = ref<"north" | "south">("north");

// 半球切换选项
const hemisphereOptions = [
  { value: "north", label: "北", icon: "🌍" },
  { value: "south", label: "南", icon: "🌏" },
];

const selectedCategory = ref<"all" | CreatureType>("all");
const categories = computed(() => {
  return ["all" as const, ...Object.values(CreatureType)];
});

// 监听分类变化，切换时回到第一页
watch(selectedCategory, () => {
  currentPage.value = 1;
});

// 根据分类筛选的生物
const filteredCreatures = computed(() => {
  let result =
    selectedCategory.value === "all"
      ? [...allCreatures.value]
      : allCreatures.value.filter(
          (creature) => creature.type === selectedCategory.value
        );

  if (selectedCategory.value === "all") {
    return result.sort((a, b) => {
      const diff = a.type - b.type;
      if (diff !== 0) return diff;
      return a.order - b.order;
    });
  } else {
    return result.sort((a, b) => a.order - b.order);
  }
});

// 分页相关
const itemsPerPage = ref(100);
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(filteredCreatures.value.length / itemsPerPage.value);
});
const creaturesToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCreatures.value.slice(start, end);
});
const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.CREATURES }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <div class="stats">
        <p class="stat-item">
          {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ filteredCreatures.length
          }}{{ UI_TEXT.STATS.CREATURES_UNIT }}
        </p>
      </div>
      <div class="filter-row">
        <div class="category-filter">
          <button
            v-for="cat in categories"
            :key="cat"
            class="category-btn"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            <span class="category-label">{{
              cat === "all" ? "全部" : getCreatureTypeName(cat)
            }}</span>
            <span class="category-count"
              >({{
                cat === "all"
                  ? allCreatures.length
                  : allCreatures.filter((r) => r.type === cat).length
              }})</span
            >
          </button>
        </div>
        <div class="toggle-group">
          <ToggleGroup
            v-model="selectedHemisphere"
            :options="hemisphereOptions"
          />
        </div>
      </div>
      <Grid
        :datas="creaturesToDisplay"
        :card-component="CreatureCard"
        :card-props="{ hemisphere: selectedHemisphere }"
      />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredCreatures.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";

.filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.category-filter {
  display: flex;
  justify-content: center;
  flex: 1;
}
</style>
