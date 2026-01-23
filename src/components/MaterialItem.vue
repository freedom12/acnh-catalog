<script setup lang="ts">
import { computed } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useItemDetailModal } from '../composables/useItemDetailModal';

interface Props {
  material: number;
  quantity: number;
}

const props = defineProps<Props>();
const { openModal } = useItemDetailModal();
const { idMap: itemIdMap } = useItemsData();

const material = computed(() => {
  let itemModel = itemIdMap.value[props.material];
  return itemModel;
});

const handleClick = () => {
  if (material.value?.id) {
    openModal(material.value.id);
  }
};

const isClickable = computed(() => !!material.value?.id);

const themeClasses = computed(() => {
  const baseClasses = ['material-item'];
  if (isClickable.value) {
    baseClasses.push('material-clickable');
  }
  return baseClasses;
});

const iconSize = computed(() => 24);
</script>

<template>
  <div :class="themeClasses" @click="handleClick">
    <div class="material-info">
      <img
        v-if="material?.icon"
        :src="material.icon"
        :alt="material.name"
        class="material-icon"
        :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
        loading="lazy"
      />
      <span class="material-name">{{ material?.name }}</span>
    </div>
    <span class="material-quantity">× {{ quantity }}</span>
  </div>
</template>

<style scoped lang="scss">
/* 基础样式 */
.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: var(--radius-2xl);
  border: 2px solid #ffcc80;
  transition: all 0.2s;

  &.material-clickable:hover {
    border-color: #ff9800;
    transform: translateY(-3px);
    box-shadow: 0 2px 6px rgb(255, 152, 0, 0.15);
  }
}

.material-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  object-fit: contain;
  background: #f5f5f5;
  border-radius: 50%;
  padding: 2px;
}

.material-name {
  font-size: 0.85em;
  color: #333;
  font-weight: 500;
}

.material-quantity {
  background: #ff9800;
  color: white;
  padding: 3px 10px;
  border-radius: var(--radius-2xl);
  font-weight: 700;
  font-size: 0.8em;
}
</style>
