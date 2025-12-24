<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  perPage: number | 'all';
  itemsCount: number;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const showPagination = computed(() => {
  return props.perPage !== 'all' && props.itemsCount > (typeof props.perPage === 'number' ? props.perPage : 0);
});
</script>

<template>
  <div v-if="showPagination" class="pagination">
    <button :disabled="currentPage === 1" @click="emit('page-change', 1)">
      首页
    </button>
    <button :disabled="currentPage === 1" @click="emit('page-change', currentPage - 1)">
      上一页
    </button>
    <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
    <button :disabled="currentPage === totalPages" @click="emit('page-change', currentPage + 1)">
      下一页
    </button>
    <button :disabled="currentPage === totalPages" @click="emit('page-change', totalPages)">
      末页
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px;
}

button {
  padding: 10px 20px;
  background: #4a9b4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #3d8142;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  margin: 0 15px;
  font-weight: 600;
  color: #333;
}
</style>
