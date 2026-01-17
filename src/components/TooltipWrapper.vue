<script setup lang="ts">
import { useTooltip } from '../composables/useTooltip';

const props = defineProps<{
  tooltip?: string;
  maxWidth?: string;
}>();

const { show, hide } = useTooltip();

const showTooltip = (event: MouseEvent) => {
  if (!props.tooltip) return;
  show(event, props.tooltip, props.maxWidth);
};

const hideTooltip = () => {
  hide();
};
</script>

<template>
  <span
    class="tooltip-wrapper"
    :class="{ 'has-tooltip': tooltip }"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.has-tooltip {
  border-bottom: 1px dashed #999;
  cursor: help;
}
</style>