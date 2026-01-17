<script setup lang="ts">
import { computed } from 'vue';
import { getSourceName } from '../services/dataService';
import TooltipWrapper from './TooltipWrapper.vue';

const props = defineProps<{
  sources: string[];
  sourceNotes?: string[];
  inline?: boolean;
  tooltipMaxWidth?: string;
}>();

const sourceWithNotes = computed(() => {
  return props.sources.map((source, index) => ({
    name: getSourceName(source) || source,
    note: props.sourceNotes?.[index],
  }));
});
</script>

<template>
  <span v-if="inline" class="source-list-inline">
    <template v-for="(source, index) in sourceWithNotes" :key="index">
      <span v-if="index > 0">, </span>
      <TooltipWrapper :tooltip="source.note" :maxWidth="tooltipMaxWidth">
        {{ source.name }}
      </TooltipWrapper>
    </template>
  </span>
  <span v-else class="source-list-multi">
    <span v-if="sourceWithNotes.length === 0" class="source-wrapper"> -- </span>
    <TooltipWrapper
      v-for="(source, index) in sourceWithNotes"
      :key="index"
      :tooltip="source.note"
      :maxWidth="tooltipMaxWidth"
    >
      {{ source.name }}
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
