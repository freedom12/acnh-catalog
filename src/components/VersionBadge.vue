<script setup lang="ts">
interface Props {
  version?: string | null;
}

defineProps<Props>();
</script>

<template>
  <div v-if="version" class="version-badge">
    {{ version }}
  </div>
</template>

<style scoped>
.version-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}
</style>
