<script setup lang="ts">
defineProps<{
  totalItems: number;
  displayedItems: number;
  ownedItems: number;
}>();
</script>

<template>
  <div class="stats">
    <div>
      总物品数: <strong>{{ totalItems.toLocaleString() }}</strong>
    </div>
    <div>
      当前显示: <strong>{{ displayedItems.toLocaleString() }}</strong>
    </div>
    <div>
      已拥有: <strong>{{ ownedItems.toLocaleString() }}</strong>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #495057;
}

.stat-item strong {
  color: #4a9b4f;
  font-size: 16px;
  margin-left: 5px;
}
</style>
