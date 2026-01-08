<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  perPage: number | "all";
  datasCount: number;
}>();

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

const showPagination = computed(() => {
  return (
    props.perPage !== "all" &&
    props.datasCount > (typeof props.perPage === "number" ? props.perPage : 0)
  );
});
</script>

<template>
  <div v-if="showPagination" class="pagination">
    <button class="action-btn primary" :disabled="currentPage === 1" @click="emit('page-change', 1)">
      首页
    </button>
    <button
      class="action-btn primary"
      :disabled="currentPage === 1"
      @click="emit('page-change', currentPage - 1)"
    >
      上一页
    </button>
    <span class="page-info"
      >第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span
    >
    <button
      class="action-btn primary"
      :disabled="currentPage === totalPages"
      @click="emit('page-change', currentPage + 1)"
    >
      下一页
    </button>
    <button
      class="action-btn primary"
      :disabled="currentPage === totalPages"
      @click="emit('page-change', totalPages)"
    >
      末页
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/view-styles";

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px;
}

.page-info {
  margin: 0 15px;
  font-weight: 600;
  color: var(--secondary-color);
}
</style>
