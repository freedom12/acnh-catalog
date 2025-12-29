<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useArtworkData } from "../composables/useArtworkData";
import { DATA_LOADING, UI_TEXT } from "../constants";
import Grid from "../components/Grid.vue";
import ArtworkCard from "../components/ArtworkCard.vue";
import Pagination from "../components/Pagination.vue";

// 使用艺术品数据加载组合函数
const { allArtwork, loading, error, loadData } = useArtworkData();

// 分页相关
const currentPage = ref(1);
const perPage = ref(100);

// 计算分页数据
const paginatedArtwork = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return allArtwork.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(allArtwork.value.length / perPage.value);
});

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 页面加载时获取数据
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="tab">
    <div v-if="loading" class="loading">{{ DATA_LOADING.ARTWORKS }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="stats">
        <p class="stat-item">
          {{ UI_TEXT.STATS.TOTAL_ITEMS }}{{ allArtwork.length
          }}{{ UI_TEXT.STATS.ARTWORKS_UNIT }}
        </p>
      </div>
      <Grid :datas="paginatedArtwork" :card-component="ArtworkCard" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :items-count="allArtwork.length"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
@import "../styles/tab-styles.css";
</style>
