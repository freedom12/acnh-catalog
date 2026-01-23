<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  selected?: boolean;
  partial?: boolean; // 部分选中状态（空心对号）
  size?: 'small' | 'normal';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  partial: false,
  size: 'normal',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const stateClass = computed(() => {
  if (props.partial) return 'partial';
  if (props.selected) return 'selected';
  return 'unselected';
});

const handleClick = (event: Event) => {
  event.stopPropagation();
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <span
    class="checkmark"
    :class="[stateClass, size, { disabled }]"
    @click="handleClick"
  >
    ✓
  </span>
</template>

<style lang="scss" scoped>
.checkmark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.disabled) {
    transform: scale(1.1);
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  // 尺寸
  &.normal {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  &.small {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  // 状态
  &.selected {
    background: var(--main-color);
    border: 2px solid var(--main-color);
    color: white;
  }

  &.unselected {
    background: transparent;
    border: 2px solid rgba(128, 128, 128, 0.6);
    color: rgba(128, 128, 128, 0.6);
  }

  &.partial {
    background: transparent;
    border: 2px solid var(--main-color);
    color: var(--main-color);
  }
}
</style>
