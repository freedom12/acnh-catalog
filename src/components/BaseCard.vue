<script setup lang="ts">
import { ref, computed } from 'vue';
import { processImageUrl } from '../utils/imageUtils';
import { adjustBrightness } from '../utils/common';
import VersionBadge from './VersionBadge.vue';
import type { Version } from '../types/item';
import { useSelection } from '../composables/useSelection';

interface Props {
  colorClass?: string;
  colorTheme?: string;
  version?: Version;
  images: string[];
  icon?: string;
  displayName: string;
  shape?: 'circle' | 'rounded' | 'square';
  detailed?: boolean;
  variant?: 'light' | 'dark';
  shiny?: boolean;
  selectionKey?: string;
  getSelectId?: () => string | number | (string | number)[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
  shape: 'circle',
  shiny: false,
  selectionKey: '',
});

const emit = defineEmits<{
  'image-index-changed': [index: number];
  click: [event: Event];
}>();

// 获取选择ID的函数，默认返回undefined（表示不支持选择）
const getSelectId = () => {
  if (props.getSelectId) {
    return props.getSelectId();
  }
  return undefined; // 默认不支持选择，除非提供getSelectId函数
};

// 是否启用选择功能
const isSelectable = computed(() => {
  return !!(props.getSelectId && props.selectionKey);
});

// 勾选相关
const selectionComposable = isSelectable.value ? useSelection(props.selectionKey!) : null;

const isSelected = (id: string | number) => {
  const result = selectionComposable ? selectionComposable.isSelected(id) : false;
  return result;
};

const toggleSelected = (id: string | number) => {
  if (selectionComposable) {
    selectionComposable.toggleSelected(id);
  }
};

const isItemSelected = computed(() => {
  if (!isSelectable.value) return false;
  const id = getSelectId();
  if (Array.isArray(id)) {
    // 如果是数组，检查是否所有ID都选中
    return id.length > 0 && id.every((itemId) => isSelected(itemId));
  } else {
    return id !== undefined && id !== null ? isSelected(id) : false;
  }
});

// 计算部分选中的状态（用于空心对号）
const isPartiallySelected = computed(() => {
  if (!isSelectable.value) return false;
  const id = getSelectId();
  if (Array.isArray(id)) {
    const selectedCount = id.filter((itemId) => isSelected(itemId)).length;
    return selectedCount > 0 && selectedCount < id.length;
  }
  return false;
});

// 获取ID数组（用于显示多个对号）
const getSelectIds = computed(() => {
  const id = getSelectId();
  const ids = Array.isArray(id) ? id : id !== undefined && id !== null ? [id] : [];
  return ids;
});

// 计算checkmark状态类
const checkmarkStateClass = computed(() => {
  if (!isSelectable.value) return '';
  if (isPartiallySelected.value) return 'partial';
  if (isItemSelected.value) return 'selected';
  return 'unselected';
});

const handleCardClick = (event: Event) => {
  if (isSelectable.value) {
    const id = getSelectId();
    if (!Array.isArray(id) && id !== undefined && id !== null) {
      // 只有单个ID时才处理卡片点击
      toggleSelected(id);
    } else {
      // 数组ID时，触发原来的点击事件（可能打开详情等）
      emit('click', event);
    }
  } else {
    // 否则触发原来的点击事件
    emit('click', event);
  }
};

const handleCheckmarkClick = (event: Event) => {
  event.stopPropagation();
  if (isSelectable.value) {
    const ids = getSelectIds.value;
    if (ids.length === 1) {
      // 单个ID时，切换单个选中状态
      const singleId = ids[0];
      if (singleId !== undefined && singleId !== null) {
        toggleSelected(singleId);
      }
    } else if (ids.length > 1) {
      // 多个ID时，切换所有parts的选中状态
      const allSelected = ids.every((id) => isSelected(id));
      ids.forEach((id) => {
        if (allSelected) {
          // 如果全部选中，则全部取消选中
          if (isSelected(id)) toggleSelected(id);
        } else {
          // 如果不是全部选中，则全部选中
          if (!isSelected(id)) toggleSelected(id);
        }
      });
    }
  }
};

// 处理单个part的对号点击
const handlePartCheckmarkClick = (partId: string | number, event: Event) => {
  event.stopPropagation();
  console.log('Part checkmark clicked:', partId);
  if (isSelectable.value) {
    console.log('Toggling selection for:', partId);
    toggleSelected(partId);
  } else {
    console.log('Not selectable');
  }
};

// 当前图片形状
const currentShape = computed(() => props.shape);

// 当前显示的图片索引
const currentImageIndex = ref(0);

// 当前显示的图片
const currentImage = computed(() =>
  processImageUrl(props.images[currentImageIndex.value] || '')
);

// 图片加载状态
const imageLoaded = ref(false);

// 是否有多个图片
const hasMultipleImages = computed(() => props.images.length > 1);

// 切换到上一张图片
const prevImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value > 0 ? currentImageIndex.value - 1 : props.images.length - 1;
    imageLoaded.value = false; // 重置加载状态
    emit('image-index-changed', currentImageIndex.value);
  }
};

// 切换到下一张图片
const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value < props.images.length - 1 ? currentImageIndex.value + 1 : 0;
    imageLoaded.value = false; // 重置加载状态
    emit('image-index-changed', currentImageIndex.value);
  }
};

// 切换到指定索引的图片
const goToImage = (index: number) => {
  currentImageIndex.value = index;
  imageLoaded.value = false; // 重置加载状态
  emit('image-index-changed', index);
};

// 计算卡片变体类名
const variantClass = computed(() => {
  return props.variant === 'light' ? 'card--variant-light' : 'card--variant-dark';
});

// 卡片样式
const cardStyles = computed(() => {
  const styles: Record<string, string> = {};
  if (props.colorTheme) {
    const baseColor = props.colorTheme;
    const mainColor = adjustBrightness(baseColor, -0.3);
    styles['--base-color'] = baseColor;
    styles['--main-color'] = mainColor;
  }
  return styles;
});
</script>

<template>
  <div
    class="card"
    :class="[
      colorClass,
      variantClass,
      {
        'card--custom-theme': colorTheme,
        'card--shiny': shiny,
      },
    ]"
    :style="cardStyles"
  >
    <div
      v-if="isSelectable"
      class="checkmark-click-area"
      :class="checkmarkStateClass"
      @click.stop="handleCheckmarkClick"
    ></div>
    <VersionBadge :version="version" />
    <div class="card-image-container" :class="{ 'large-image': !detailed }">
      <div
        class="card-image-wrapper"
        :class="{
          rounded: currentShape === 'rounded',
          square: currentShape === 'square',
          'large-image': !detailed,
        }"
        @click="handleCardClick"
      >
        <img
          :src="imageLoaded ? currentImage : icon || currentImage"
          :alt="displayName"
          class="card-image"
          :class="{ 'large-image': !detailed }"
          loading="lazy"
          @load="imageLoaded = true"
          @error="imageLoaded = true"
        />
      </div>

      <!-- 右下角图标 -->
      <img v-if="icon" :src="icon" alt="icon" class="card-corner-icon" />

      <!-- 图片指示器 -->
      <div v-if="hasMultipleImages" class="image-indicators">
        <span
          v-for="(_, index) in props.images"
          :key="index"
          class="indicator"
          :class="{ active: index === currentImageIndex }"
          @click.stop="goToImage(index)"
        ></span>
      </div>

      <!-- 左右切换按钮 -->
      <button
        v-if="hasMultipleImages && detailed"
        class="image-nav-btn image-nav-prev"
        @click.stop="prevImage"
      >
        ‹
      </button>
      <button
        v-if="hasMultipleImages && detailed"
        class="image-nav-btn image-nav-next"
        @click.stop="nextImage"
      >
        ›
      </button>
    </div>
    <div class="card-info">
      <slot name="name">
        <h3 class="card-name">
          {{ displayName }}
        </h3>
      </slot>
      <!-- 多个parts的对号显示 -->
      <div v-if="getSelectIds.length > 1" class="parts-checkmarks">
        <span
          v-for="partId in getSelectIds"
          :key="partId"
          class="part-checkmark"
          :class="
            isSelected(partId) ? 'part-checkmark--selected' : 'part-checkmark--unselected'
          "
          @click.stop="handlePartCheckmarkClick(partId, $event)"
        >
          ✓
        </span>
      </div>
      <div v-if="detailed" class="card-details">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../styles/card-styles';
</style>
