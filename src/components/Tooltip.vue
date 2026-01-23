<script setup lang="ts">
import { useTooltip } from '../composables/useTooltip';

const { visible, position, content, maxWidth } = useTooltip();
</script>

<template>
  <Teleport to="body">
    <div v-show="visible" class="tooltip-fixed" :style="{ ...position, maxWidth }">
      {{ content }}
      <div class="tooltip-arrow"></div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.tooltip-fixed {
  position: fixed;
  transform: translate(-50%, -100%);
  padding: 12px;
  background: rgb(0, 0, 0, 0.9);
  color: #fff;
  font-size: 12px;
  border-radius: var(--radius-2xl);
  white-space: pre-wrap;
  overflow-wrap: break-word;
  pointer-events: none;
  z-index: 999999;
  box-shadow: 0 2px 8px rgb(0, 0, 0, 0.3);
}

.tooltip-arrow {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgb(0, 0, 0, 0.9);
}
</style>
