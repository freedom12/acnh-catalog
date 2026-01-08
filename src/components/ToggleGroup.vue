<script setup lang="ts">
interface ToggleOption {
  value: string | number;
  label: string;
  icon?: string;
}

interface Props {
  modelValue: string | number;
  options: ToggleOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const handleSelect = (value: string | number) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="toggle-group">
    <button
      v-for="option in options"
      :key="option.value"
      class="toggle-btn"
      :class="{ active: props.modelValue === option.value }"
      @click="handleSelect(option.value)"
    >
      <span v-if="option.icon">{{ option.icon }}</span>
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/view-styles";
</style>
