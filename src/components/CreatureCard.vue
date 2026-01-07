<script setup lang="ts">
import type { Creature } from "../types/creature";
import { UI_TEXT } from "../constants";
import BaseCard from "./BaseCard.vue";
import { ref, computed } from "vue";
import { processImageUrl } from "../utils/imageUtils";
import { getPriceStr, getCreatureTypeName } from "../services/dataService";

interface Props {
  data: Creature;
  hemisphere: "north" | "south";
}

const props = defineProps<Props>();

// 当前图片索引
const currentImageIndex = ref(0);

// 当前形状
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? "circle" : "rounded"
);

// 获取月份信息
const getMonths = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.months.join(", ");
};

// 获取时间信息
const getTime = (creature: Creature): string => {
  const hemisphere = creature.hemispheres[props.hemisphere];
  return hemisphere.time.join(", ");
};

// 获取天气信息
const getWeather = (creature: Creature): string => {
  return creature.weather || "--";
};

// 获取位置信息
const getLocation = (creature: Creature): string => {
  return creature.whereHow || "--";
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
};

// 图片索引变更处理函数
const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};

// 根据生物类型选择颜色主题
const colorClass = computed(() => {
  switch (props.data.type) {
    case 1: // Insects
      return "card--red";
    case 2: // Fish
      return "card--blue";
    case 3: // SeaCreatures
      return "card--yellow";
    default:
      return "card--green";
  }
});
</script>

<template>
  <BaseCard
    :colorClass="colorClass"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    :shape="currentShape"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{
        getCreatureTypeName(props.data.type)
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">月份</span>
      <span class="detail-value">{{ getMonths(props.data) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">时间</span>
      <span class="detail-value">{{ getTime(props.data) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">天气</span>
      <span class="detail-value">{{ getWeather(props.data) }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">出现地点</span>
      <span class="detail-value">{{ getLocation(props.data) }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">捕获台词</span>
      <span class="detail-value">{{ props.data.catchPhrase }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">描述</span>
      <span class="detail-value">{{ props.data.desc }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price">
        {{ getPriceStr(props.data.sell) }}
      </span>
    </div>
  </BaseCard>
</template>
