<script setup lang="ts">
import type { MessageCard } from "../types/messagecard";
import BaseCard from "./BaseCard.vue";
import { selectHighestContrastColor } from "../utils/common";
import { getPriceStr } from "../services/dataService";
import { computed } from "vue";

const props = defineProps<{
  data: MessageCard;
}>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
};

const nameColor = computed(() => {
  return selectHighestContrastColor(props.data.bodyColor, props.data.penColors);
});
</script>

<template>
  <BaseCard
    :version="props.data.ver"
    :images="[props.data.image]"
    :displayName="props.data.name"
    :shape="'square'"
    :style="{
      background: `linear-gradient(5deg, ${props.data.headColor} 0%, ${props.data.headColor} 10%, ${props.data.bodyColor} 10.5%, ${props.data.bodyColor} 90%, ${props.data.footColor} 90.5%, ${props.data.footColor} 100%)`,
      border: '3px solid ' + (props.data.backColor || props.data.bodyColor),
    }"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: nameColor }">
        {{ props.data.name }}
      </h3>
    </template>
    <div class="detail-row">
      <span class="detail-label">价格</span>
      <span class="detail-value highlight">
        {{ getPriceStr(props.data.buy) || "不可购买" }}
      </span>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
/* 所有模式 - MessageCard 特殊的图片样式 */
:deep(.card-image-wrapper) {
  width: 100%;
  height: auto;
  background: none;
}

:deep(.card-image) {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}

/* 简略模式 - 覆盖 BaseCard 的 aspect-ratio */
:deep(.card-image-wrapper.large-image) {
  aspect-ratio: unset !important;
}
</style>
