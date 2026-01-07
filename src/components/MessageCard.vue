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
    colorClass="card--brown"
    :version="props.data.ver"
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
      <h3
        class="card-name"
        :style="{ color: nameColor }"
      >
        {{ props.data.name }}
      </h3>
    </template>
    <div class="detail-row">
      <span class="detail-label">价格</span>
      <span class="detail-value price">
        {{ getPriceStr(props.data.buy) || "不可购买" }}
      </span>
    </div>
  </BaseCard>
</template>

<style scoped>
:deep(.card-image-wrapper) {
  width: 100%;
  height: auto;
  /* max-width: none; */
  background: none;
}

:deep(.card-image) {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
}
</style>
