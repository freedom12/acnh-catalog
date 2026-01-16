<script setup lang="ts">
import { computed } from 'vue';
import { useActivitysData } from '../composables/useActivitysData';

const { getGroupsByIds, getGroupName } = useActivitysData();
const props = defineProps<{
  activitys?: string[];
  inline?: boolean;
}>();

const activityGroups = computed(() => {
  return getGroupsByIds(props.activitys || []);
});
</script>

<template>
  <span v-if="inline" class="source-list-inline">
    <template v-for="(actGroup, index) in activityGroups" :key="index">
      <span v-if="index > 0">, </span>
      <span class="source-wrapper">
        {{ getGroupName(actGroup) }}
      </span>
    </template>
  </span>
  <span v-else class="source-list-multi">
    <span v-if="activityGroups.length === 0" class="source-wrapper"> -- </span>
    <span v-for="(actGroup, index) in activityGroups" :key="index" class="source-wrapper">
      {{ getGroupName(actGroup) }}
    </span>
  </span>
</template>

<style scoped lang="scss">
.source-list-multi {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.source-wrapper {
  position: relative;
  display: inline-block;
}
</style>
