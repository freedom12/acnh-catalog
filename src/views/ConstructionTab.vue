<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useConstructionData } from "../composables/useConstructionData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ConstructionCard from "../components/ConstructionCard.vue";
import Pagination from "../components/Pagination.vue";

// 使用改建数据加载组合函数
const { allConstruction, loading, error, loadData } = useConstructionData();

// 当前选择的分类
const selectedCategory = ref<string>("all");

// 分类选项（根据实际数据动态生成）
const categories = computed(() => {
  const categorySet = new Set<string>();
  allConstruction.value.forEach((item) => {
    if (item.category) {
      categorySet.add(item.category);
    }
  });

  const categoryList = [{ value: "all", label: "全部", icon: "🏗️" }];

  Array.from(categorySet)
    .sort()
    .forEach((cat) => {
      categoryList.push({ value: cat, label: cat, icon: "📦" });
    });

  return categoryList;
});

// 根据分类筛选的改建项目
const filteredConstruction = computed(() => {
  if (selectedCategory.value === "all") {
    // 全部分类下按类型排序
    return [...allConstruction.value].sort((a, b) => {
      const catA = a.category || "未知";
      const catB = b.category || "未知";
      return catA.localeCompare(catB, "zh-CN");
    });
  }
  return allConstruction.value.filter(
    (item) => item.category === selectedCategory.value
  );
});

// 各分类的数量统计
const categoryStats = computed(() => {
  const stats: Record<string, number> = {
    all: allConstruction.value.length,
  };

  allConstruction.value.forEach((item) => {
    if (item.category) {
      stats[item.category] = (stats[item.category] || 0) + 1;
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
          v-for="category in categories"
          :key="category.value"
          class="category-btn"
          :class="{ active: selectedCategory === category.value }"
          @click="selectedCategory = category.value"
        >
          <span class="category-label">{{ category.label }}</span>
          <span class="category-count"
            >({{ categoryStats[category.value] || 0 }})</span
          >
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
