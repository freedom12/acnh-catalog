<script setup lang="ts">
import { computed } from "vue";
import type { Recipe } from "../types/recipe";
import { UI_TEXT } from "../constants";
import BaseCard from "./BaseCard.vue";
import MaterialItem from "./MaterialItem.vue";
import SourceList from "./SourceList.vue";
import { processImageUrl } from "../utils/imageUtils";
import {
  getPriceWithIcon,
  getRecipeTypeName,
  getRecipeTypeIcon,
  getActivityName,
} from "../services/dataService";
import { useItemDetailModal } from "../composables/useItemDetailModal";

const props = defineProps<{
  data: Recipe;
}>();
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
  // 动森特殊颜色编号
  color_51: "#ffe0b2", // 浅橙色
  color_52: "#fff9c4", // 浅黄色
  color_53: "#c8e6c9", // 浅绿色
  color_54: "#bbdefb", // 浅蓝色
  color_55: "#e1bee7", // 浅紫色
  color_56: "#f8bbd0", // 浅粉色
  color_60: "#d7ccc8", // 棕色系
  color_61: "#ffccbc", // 砖红色系
  color_62: "#ffcdd2", // 浅红色
  color_63: "#dcedc8", // 青绿色
  color_64: "#b2dfdb", // 青色
  color_65: "#b2ebf2", // 天蓝色
  color_66: "#d1c4e9", // 淡紫色
  color_67: "#f0e4d7", // 奶油色系
  color_68: "#fce4ec", // 樱花粉
  color_69: "#e8eaf6", // 薰衣草色
  color_70: "#fff3e0", // 浅杏色
  color_71: "#e0f2f1", // 薄荷绿
  color_72: "#fce4ec", // 淡玫瑰色
  color_73: "#ede7f6", // 淡紫罗兰
  color_74: "#f1f8e9", // 浅黄绿
  color_75: "#e8f5e9", // 极浅绿
  color_76: "#fef5e7", // 象牙白
  color_77: "#eceff1", // 浅灰蓝
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
    class="recipe-bg"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        {{ getRecipeTypeName(props.data.type) }}
        <img :src="getRecipeTypeIcon(props.data.type)" :alt="getRecipeTypeName(props.data.type)" class="inline-icon gray" />
      </span>
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
      <span class="detail-value highlight" v-html="getPriceWithIcon(props.data.sell) || '不可出售'">
      </span>
    </div>
    <div
      v-if="Object.keys(props.data.materials).length > 0"
      class="materials-section"
    >
      <span class="materials-label">所需材料</span>
      <div class="materials-list">
        <MaterialItem
          v-for="[material, quantity] in props.data.materials"
          :key="material"
          :material="material"
          :quantity="quantity"
        />
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
/* RecipeCard特殊样式 */
.materials-section {
  background: #fff9f0;
  border-radius: var(--border-radius-xl);
  padding: 8px;
  border: 2px solid #ffe0b2;
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
