<script setup lang="ts" generic="T">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { usePagination } from "../composables/usePagination";
import Pagination from "./Pagination.vue";

interface Props {
  loading?: boolean;
  error?: string;
  onLoad?: () => void | Promise<void>;
  // 分页相关的props
  datas?: T[];
  perPage?: number;
  // Grid相关的props
  cardComponent: any;
  cardProps?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: "",
  perPage: 100,
});

const hasError = computed(() => !!props.error);

const datas = computed(() => props.datas || []);
const perPageCount = ref(props.perPage);
const { currentPage, displayDatas, totalPageCount, handlePageChange } =
  usePagination(datas as Ref<T[]>, perPageCount);

// 监听数据变化，重置到首页
watch(datas, () => {
  currentPage.value = 1;
});
const showPagination = computed(() => {
  return datas.value.length > props.perPage;
});
const hasDatas = computed(
  () => displayDatas.value && displayDatas.value.length > 0
);
onMounted(() => {
  if (props.onLoad) {
    props.onLoad();
  }
});
</script>

<template>
  <div class="view">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="hasError" class="error">{{ error }}</div>
    <template v-else>
      <!-- 筛选器插槽 -->
      <slot
        name="filters"
        :display-datas="displayDatas"
        :total-datas="datas.length"
      />

      <!-- Grid内容 -->
      <div v-if="!hasDatas" class="no-results">
        <div class="no-results-icon">😢</div>
        <h2 class="no-results-title">没有找到匹配的数据</h2>
      </div>
      <div v-else class="generic-grid">
        <component
          v-for="(data, index) in displayDatas"
          :key="(data as any).id || index"
          :is="cardComponent"
          :data="data"
          v-bind="cardProps"
        />
      </div>

      <!-- 分页组件 -->
      <Pagination
        v-if="showPagination"
        :current-page="currentPage"
        :total-pages="totalPageCount"
        :per-page="perPageCount"
        :datas-count="datas.length"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped>
@import "../styles/view-styles.css";
</style>
