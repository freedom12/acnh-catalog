<script setup lang="ts">
import { ref, computed } from 'vue';
import { processImageUrl } from '../utils/imageUtils';
import { adjustBrightness } from '../utils/common';
import VersionBadge from './VersionBadge.vue';
import type { Version } from '../types/item';

interface Props {
  colorClass?: string;
  colorTheme?: string;
  version?: Version;
  images: string[];
  displayName: string;
  shape?: 'circle' | 'rounded' | 'square';
  detailed?: boolean;
  variant?: 'light' | 'dark';
  showCheckmark?: boolean;
  shiny?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
  shape: 'circle',
  shiny: false,
});

const emit = defineEmits<{
  'image-index-changed': [index: number];
  click: [event: Event];
}>();

// 当前图片形状
const currentShape = computed(() => props.shape);

// 当前显示的图片索引
const currentImageIndex = ref(0);

// 当前显示的图片
const currentImage = computed(() =>
  processImageUrl(props.images[currentImageIndex.value] || '')
);

// 是否有多个图片
const hasMultipleImages = computed(() => props.images.length > 1);

// 切换到上一张图片
const prevImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value > 0 ? currentImageIndex.value - 1 : props.images.length - 1;
    emit('image-index-changed', currentImageIndex.value);
  }
};

// 切换到下一张图片
const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value < props.images.length - 1 ? currentImageIndex.value + 1 : 0;
    emit('image-index-changed', currentImageIndex.value);
  }
};

// 切换到指定索引的图片
const goToImage = (index: number) => {
  currentImageIndex.value = index;
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
        'card--with-checkmark': showCheckmark,
        'card--custom-theme': colorTheme,
        'card--shiny': shiny,
      },
    ]"
    :style="cardStyles"
  >
    <VersionBadge :version="version" />
    <div class="card-image-container" :class="{ 'large-image': !detailed }">
      <div
        class="card-image-wrapper"
        :class="{
          rounded: currentShape === 'rounded',
          square: currentShape === 'square',
          'large-image': !detailed,
        }"
        @click="$emit('click', $event)"
      >
        <img
          :src="currentImage"
          :alt="displayName"
          class="card-image"
          :class="{ 'large-image': !detailed }"
          loading="lazy"
        />
      </div>

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
        <h3 class="card-name">{{ displayName }}</h3>
      </slot>
      <div v-if="detailed" class="card-details">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../styles/card-styles';
</style>
