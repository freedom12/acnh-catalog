<script setup lang="ts">
import { ref, computed } from "vue";
import VersionBadge from "./VersionBadge.vue";

interface Props {
  colorClass: string;
  version?: string | null;
  images: string[];
  displayName: string;
  shape?: "circle" | "rounded" | "square";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "image-index-changed": [index: number];
  click: [event: Event];
}>();

// 当前图片形状
const currentShape = computed(() => props.shape || "circle");

// 当前显示的图片索引
const currentImageIndex = ref(0);

// 当前显示的图片
const currentImage = computed(
  () => props.images[currentImageIndex.value] || ""
);

// 是否有多个图片
const hasMultipleImages = computed(() => props.images.length > 1);

// 切换到上一张图片
const prevImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value > 0
        ? currentImageIndex.value - 1
        : props.images.length - 1;
    emit("image-index-changed", currentImageIndex.value);
  }
};

// 切换到下一张图片
const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value =
      currentImageIndex.value < props.images.length - 1
        ? currentImageIndex.value + 1
        : 0;
    emit("image-index-changed", currentImageIndex.value);
  }
};
</script>

<template>
  <div class="card" :class="colorClass">
    <VersionBadge :version="version" />
    <div class="card-image-container">
      <div
        class="card-image-wrapper"
        :class="{
          rounded: currentShape === 'rounded',
          square: currentShape === 'square',
        }"
        @click="$emit('click', $event)"
      >
        <img
          :src="currentImage"
          :alt="displayName"
          class="card-image"
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
        ></span>
      </div>

      <!-- 左右切换按钮 -->
      <button
        v-if="hasMultipleImages"
        class="image-nav-btn image-nav-prev"
        @click.stop="prevImage"
      >
        ‹
      </button>
      <button
        v-if="hasMultipleImages"
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
      <div class="card-details">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
@import "../styles/Card.css";
</style>
