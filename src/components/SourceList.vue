<script setup lang="ts">
import { computed } from "vue";
import { getSourceName } from "../services/dataService";
import { useTooltip } from "../composables/useTooltip";

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

const { show, hide } = useTooltip();

const showTooltip = (event: MouseEvent, note?: string) => {
  if (!note) return;
  show(event, note, props.tooltipMaxWidth);
};

const hideTooltip = () => {
  hide();
};
</script>

<template>
  <span v-if="inline" class="source-list-inline">
    <template v-for="(source, index) in sourceWithNotes" :key="index">
      <span v-if="index > 0">, </span>
      <span
        class="source-wrapper"
        :class="{ 'has-note': source.note }"
        @mouseenter="showTooltip($event, source.note)"
        @mouseleave="hideTooltip"
      >
        {{ source.name }}
      </span>
    </template>
  </span>
  <span v-else class="source-list-multi">
    <span v-if="sourceWithNotes.length === 0" class="source-wrapper"> -- </span>
    <span
      v-for="(source, index) in sourceWithNotes"
      :key="index"
      class="source-wrapper"
      :class="{ 'has-note': source.note }"
      @mouseenter="showTooltip($event, source.note)"
      @mouseleave="hideTooltip"
    >
      {{ source.name }}
    </span>
  </span>
</template>

<style scoped>
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

.has-note {
  border-bottom: 1px dashed #999;
  cursor: help;
}
</style>
