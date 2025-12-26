<script setup lang="ts">
import { ref } from "vue";
import type { MessageCard } from "../types/messagecard";
import BaseCard from "./BaseCard.vue";
import { UI_TEXT } from "../constants";
import { formatPrice } from "../utils/common";

const props = defineProps<{
  data: MessageCard;
}>();

const imgRef = ref<HTMLImageElement>();
const aspectRatio = ref(1);

const onImageLoad = () => {
  if (imgRef.value) {
    aspectRatio.value = imgRef.value.naturalWidth / imgRef.value.naturalHeight;
  }
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
};
</script>

<template>
  <BaseCard
    colorClass="card--brown"
    :version="undefined"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :shape="'rounded'"
    :style="{
      background: props.data.bodyColor,
      border: '3px solid ' + props.data.headColor,
    }"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.headColor }">
        {{ props.data.name }}
      </h3>
    </template>
    <div class="detail-row">
      <span class="detail-label">价格</span>
      <span class="detail-value price">
        {{ formatPrice(props.data.buy) }} {{ UI_TEXT.CURRENCY }}
      </span>
    </div>
  </BaseCard>
  <img
    ref="imgRef"
    :src="props.data.image"
    @load="onImageLoad"
    style="display: none"
  />
</template>

<style scoped>
/* 让图片填满容器并保持比例 */
:deep(.card-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 动态调整容器宽高比以匹配图片比例 */
:deep(.card-image-wrapper) {
  --aspect-ratio: v-bind(aspectRatio);
  aspect-ratio: var(--aspect-ratio);
  width: 100%;
  height: auto;
  margin: 0 0 12px;
  background: none;
}
</style>
