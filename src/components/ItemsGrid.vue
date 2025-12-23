<script setup lang="ts">
import type { Item } from '../types';
import ItemCard from './ItemCard.vue';

defineProps<{
  items: Item[];
  colorFilter?: string;
}>();
</script>

<template>
  <div v-if="items.length === 0" class="no-results">
    <div>😢</div>
    <h2>没有找到匹配的物品</h2>
  </div>
  <div v-else class="items-grid">
    <ItemCard v-for="item in items" :key="item.id" :item="item" :color-filter="colorFilter" />
  </div>
</template>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results div {
  font-size: 60px;
  margin-bottom: 20px;
}

.no-results h2 {
  color: #999;
  font-weight: 400;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
</style>
