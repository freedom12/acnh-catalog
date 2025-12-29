<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useConstructionData } from "../composables/useConstructionData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ConstructionCard from "../components/ConstructionCard.vue";
import Pagination from "../components/Pagination.vue";
import { ConstructionType } from "../types/construction";
import { getConstrunctionTypeName } from "../services/dataService";

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

const selectedCategory = ref<"all" | ConstructionType>("all");
const categories = computed(() => {
  return ["all" as const, ...Object.values(ConstructionType)];
});

// 监听分类变化，切换时回到第一页
watch(selectedCategory, () => {
  currentPage.value = 1;
});

// 根据分类筛选的改建项目
const filteredConstruction = computed(() => {
  if (selectedCategory.value === "all") {
    return [...allConstruction.value].sort((a, b) => {
      return a.id - b.id;
    });
  }
  return allConstruction.value.filter(
    (item) => item.type === selectedCategory.value
  );
});

// 各分类的数量统计
const categoryStats = computed(() => {
  const stats: Record<string, number> = {
    all: allConstruction.value.length,
  };

  allConstruction.value.forEach((item) => {
    if (item.type) {
      stats[item.type] = (stats[item.type] || 0) + 1;
    }
  });

  return stats;
});

// 分页相关
const itemsPerPage = ref(100);
const currentPage = ref(1);
const totalPages = computed(() => {
  return Math.ceil(filteredConstruction.value.length / itemsPerPage.value);
});
const constructionToDisplay = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredConstruction.value.slice(start, end);
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
    <div v-if="loading" class="loading">{{ DATA_LOADING.CONSTRUCTION }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <div class="stats">
        <p class="stat-item">
          {{ UI_TEXT.STATS.TOTAL_ITEMS
          }}{{ filteredConstruction.length }} 个改建项目
        </p>
      </div>
      <div class="category-filter">
        <button
          v-for="cat in categories"
          :key="cat"
          class="category-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          <span class="category-label">{{
            cat === "all" ? "全部" : getConstrunctionTypeName(cat)
          }}</span>
          <span class="category-count">({{ categoryStats[cat] || 0 }})</span>
        </button>
      </div>
      <Grid :datas="constructionToDisplay" :card-component="ConstructionCard" />
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="itemsPerPage"
        :items-count="filteredConstruction.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
