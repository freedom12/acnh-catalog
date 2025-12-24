<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  datas: any[];
  cardComponent: any;
  cardProps?: Record<string, any>;
}

const props = defineProps<Props>();

const hasDatas = computed(() => props.datas && props.datas.length > 0);
</script>

<template>
  <div v-if="!hasDatas" class="no-results">
    <div>😢</div>
    <h2>没有找到匹配的数据</h2>
  </div>
  <div v-else class="generic-grid">
    <component
      v-for="data in props.datas"
      :key="data.id || data.uniqueEntryId || data.name"
      :is="props.cardComponent"
      :data="data"
      v-bind="props.cardProps"
    />
  </div>
</template>

<style scoped>
.generic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  .generic-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
</style>