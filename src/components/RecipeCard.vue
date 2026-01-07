<script setup lang="ts">
import { computed } from "vue";
import type { Recipe } from "../types/recipe";
import { UI_TEXT } from "../constants";
import BaseCard from "./BaseCard.vue";
import MaterialItem from "./MaterialItem.vue";
import SourceList from "./SourceList.vue";
import { processImageUrl } from "../utils/imageUtils";
import {
  getPriceStr,
  getRecipeTypeName,
  getActivityName,
} from "../services/dataService";
import { useItemDetailModal } from "../composables/useItemDetailModal";

interface Props {
  data: Recipe;
}

const props = defineProps<Props>();
const { openModal } = useItemDetailModal();

const handleClick = () => {
  openModal(props.data.itemId);
};

// 颜色映射表
const colorMap: Record<string, string> = {
  red: "#ffcdd2",
  orange: "#ffe0b2",
  yellow: "#fff9c4",
  green: "#c8e6c9",
  blue: "#bbdefb",
  purple: "#e1bee7",
  pink: "#f8bbd0",
  brown: "#d7ccc8",
  beige: "#efebe9",
  white: "#fafafa",
  cream: "#fff8e1",
  gray: "#e0e0e0",
  "light gray": "#f5f5f5",
  "dark gray": "#bdbdbd",
  gold: "#fff9c4",
  silver: "#e0e0e0",
  brick: "#ffccbc",
};

// 计算主题颜色
const themeColor = computed(() => {
  const color = props.data.cardColor;
  return (color && color in colorMap ? colorMap[color] : colorMap["orange"])!;
});

// 判断是否为金银主题
const isShiny = computed(() => {
  const color = props.data.cardColor;
  return color === "gold" || color === "silver";
});

</script>

<template>
  <BaseCard
    :colorTheme="themeColor"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    :shiny="isShiny"
    variant="dark"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ getRecipeTypeName(props.data.type) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ "季节/庆典" }}</span>
      <span class="detail-value">{{
        getActivityName(props.data.activity || "") || "--"
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="props.data.source"
        :sourceNotes="props.data.sourceNotes"
      />
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price">
        {{ getPriceStr(props.data.sell) || "不可出售" }}
      </span>
    </div>
    <div
      v-if="Object.keys(props.data.materials).length > 0"
      class="materials-section"
    >
      <span class="materials-label">所需材料</span>
      <div class="materials-list">
        <MaterialItem
          v-for="(quantity, material) in props.data.materials"
          :key="material"
          :material="material"
          :quantity="quantity"
        />
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
/* RecipeCard特殊样式 */
.materials-section {
  background: #fff9f0;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ffe0b2;
  margin-top: 8px;
}

.materials-label {
  font-weight: 600;
  color: #e65100;
  font-size: 0.85em;
  display: block;
  margin-bottom: 8px;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
