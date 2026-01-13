<script setup lang="ts">
import { computed, ref } from 'vue';
import { useItemsData } from '../composables/useItemsData';
import { useItemDetailModal } from '../composables/useItemDetailModal';
import { processImageUrl } from '../utils/imageUtils';

const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    default: 100,
  },
  vIndex: {
    type: Number,
    default: 0,
  },
  pIndex: {
    type: Number,
    default: 0,
  },
});

const { openModal } = useItemDetailModal();
const { itemIdMap } = useItemsData();

const itemModel = computed(() => {
  let item = itemIdMap.value[props.itemId]
  if (!item) {
    console.warn(`ItemIcon: Item model not found for itemId ${props.itemId}`);
  }
  return item;
});
const name = computed(() => itemModel.value?.name || '');
const image = computed(() => {
  if (!itemModel.value) {
    // console.warn(`ItemIcon: Item model not found for itemId ${props.itemId}`);
    return '';
  };

  let pattern = itemModel.value.getPattern(props.vIndex, props.pIndex);
  if (!pattern) {
    return itemModel.value.image;
  }
  if (pattern.id != props.itemId) {
    pattern = itemModel.value.getPatternById(props.itemId);
  }
  if (!pattern) {
    return itemModel.value.image;
  }
  return processImageUrl(pattern.image);
});

const showPreview = ref(false);

const handleMouseOver = () => {
  if (props.size < 100) showPreview.value = true;
};

const handleMouseLeave = () => {
  showPreview.value = false;
};

const handleClick = () => {
  if (itemModel.value?.id) openModal(itemModel.value.id);
};
</script>

<template>
  <div
    class="item-icon-container"
    :style="{ width: props.size + 'px' }"
    :class="{ 'item-icon-clickable': itemModel?.id }"
    @click="handleClick"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <img
      v-if="image"
      :src="image"
      :alt="name"
      :style="{ width: props.size + 'px', height: props.size + 'px' }"
      class="item-icon"
      loading="lazy"
    />
    <transition name="preview">
      <div v-if="showPreview" class="preview-overlay">
        <img
          v-if="image"
          :src="image"
          alt="preview"
          class="preview-icon"
          loading="lazy"
        />
        <hr v-if="name" class="preview-separator" />
        <span v-if="name" class="preview-name">{{ name }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.item-icon {
  padding: 5px;
}

.item-icon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: white;
  border-radius: var(--border-radius-lg);
  transition: all 0.2s ease;

  &.item-icon-clickable {
    cursor: pointer;
  }
}

.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: var(--border-radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 10;
  padding: 4px;
}

.preview-icon {
  width: 130px;
  height: 130px;
}

.preview-separator {
  width: 100%;
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: -2px 0;
}

.preview-name {
  font-size: 14px;
  text-align: center;
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
  overflow-wrap: break-word;
  color: #333;
  padding: 0 4px;
}

.preview-enter-active,
.preview-leave-active {
  transition: all 0.3s ease;
}

.preview-enter-from,
.preview-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.preview-enter-to,
.preview-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
</style>
