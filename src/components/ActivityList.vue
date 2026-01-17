<script setup lang="ts">
import { computed } from 'vue';
import { useActivitysData } from '../composables/useActivitysData';
import TooltipWrapper from './TooltipWrapper.vue';

const { getGroupsByIds, getGroupName, getDateStr, activityGroupMap } = useActivitysData();
const props = defineProps<{
  activitys?: string[];
  inline?: boolean;
}>();

const activityGroups = computed(() => {
  return getGroupsByIds(props.activitys || []).map(group => {
    const activities = activityGroupMap.value[group];
    const tooltip = activities ? activities.map(act => getDateStr(act)).filter(date => date).join('\n') : '';
    return {
      group,
      name: getGroupName(group, true),
      tooltip,
    };
  });
});
</script>

<template>
  <span v-if="inline" class="source-list-inline">
    <template v-for="(actGroup, index) in activityGroups" :key="index">
      <span v-if="index > 0">, </span>
      <TooltipWrapper :tooltip="actGroup.tooltip">
        <span v-html="actGroup.name"></span>
      </TooltipWrapper>
    </template>
  </span>
  <span v-else class="source-list-multi">
    <span v-if="activityGroups.length === 0" class="source-wrapper"> -- </span>
    <TooltipWrapper
      v-for="(actGroup, index) in activityGroups"
      :key="index"
      :tooltip="actGroup.tooltip"
    >
      <span v-html="actGroup.name"></span>
    </TooltipWrapper>
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
