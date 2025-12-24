<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { Item } from "../types";
import { getSeriesName, getTagName } from "../services/dataService";
import { formatPrice, joinArray } from "../utils/common";
import { ItemModel } from "../models";
import BaseCard from "./BaseCard.vue";
import ColorBlock from "./ColorBlock.vue";
import { UI_TEXT } from "../constants";

const props = defineProps<{
  data: Item;
  colorFilter?: string;
}>();

const router = useRouter();

// 创建 ItemModel 实例
const itemModel = new ItemModel(props.data);

// 使用简单的 ref 管理响应式状态 - 直接访问 ItemModel 内部的 ref
const variantIndex = computed({
  get: () => itemModel.getVariantIndex(),
  set: (val: number) => itemModel.setVariantIndex(val),
});

const patternIndex = computed({
  get: () => itemModel.getPatternIndex(),
  set: (val: number) => itemModel.setPatternIndex(val),
});

// 计算属性 - 基于 ItemModel 方法，这些会自动响应内部 ref 的变化
const currentVariant = computed(() => itemModel.getCurrentVariant());
const displayImage = computed(() => itemModel.getDisplayImage());
const displayId = computed(() => itemModel.getDisplayId());
const displayColors = computed(() => itemModel.getDisplayColors());
const displayName = computed(() => itemModel.getDisplayName());
const hasMultipleVariants = computed(() => itemModel.hasMultipleVariants());
const hasPatterns = computed(() => itemModel.hasPatterns());

// 便捷方法
const version = computed(() => itemModel.getVersion());
const size = computed(() => itemModel.getSize());
const seriesName = computed(() => itemModel.getSeriesName());
const tag = computed(() => itemModel.getTag());

// 价格信息
const buyPrice = computed(() => itemModel.getBuyPrice());
const sellPrice = computed(() => itemModel.getSellPrice());

// 应用颜色筛选
const applyColorFilter = () => {
  if (props.colorFilter && props.data.variantGroups?.length) {
    const match = itemModel.findVariantByColor(props.colorFilter);
    if (match) {
      variantIndex.value = match.variantIndex;
      patternIndex.value = match.patternIndex;
    }
  }
};

// 重置并应用颜色筛选
const resetAndApplyColorFilter = () => {
  variantIndex.value = 0;
  patternIndex.value = 0;
  applyColorFilter();
};

// 初始化时应用颜色筛选
onMounted(() => {
  applyColorFilter();
});

// 监听颜色筛选器变化
watch(
  () => props.colorFilter,
  resetAndApplyColorFilter
);

// 点击卡片跳转到详情页
const handleCardClick = (event: MouseEvent) => {
  // 如果点击的是款式或图案切换按钮，不跳转
  if ((event.target as HTMLElement)?.closest('.variation-dot')) {
    return;
  }

  router.push(`/item/${props.data.id}`);
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    :class="{ 'item-owned': props.data.owned }"
    :version="version !== '未知版本' ? version : undefined"
    :image="displayImage"
    :displayName="displayName"
    @click="handleCardClick"
  >
    <span class="detail-row detail-center">
      ID: {{ displayId || "N/A" }}
      <ColorBlock
        v-if="displayColors.length > 0"
        :displayColors="displayColors"
        :size="16"
      />
    </span>
    <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value">{{ size }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">系列</span>
      <span class="detail-value">{{ getSeriesName(seriesName) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">标签</span>
      <span class="detail-value">{{ getTagName(tag) }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <span class="detail-value">{{ joinArray(props.data.source) }}</span>
    </div>
    <div class="detail-row">
      <span class="buy-price" title="购买价格">
        💰 {{ formatPrice(buyPrice) }}
      </span>
      <span class="sell-price" title="出售价格">
        💵 {{ formatPrice(sellPrice) }}
      </span>
    </div>

    <div v-if="hasMultipleVariants" class="variants-section variant-row">
      <span class="variants-label">款式</span>
      <div class="variants-list">
        <span
          v-for="(vg, vIdx) in props.data.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{ active: vIdx === variantIndex }"
          :title="vg.variantName || `款式 ${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          {{ vIdx + 1 }}
        </span>
      </div>
    </div>
    <div v-if="hasPatterns" class="variants-section pattern-row">
      <span class="variants-label">图案</span>
      <div class="variants-list">
        <span
          v-for="(p, pIdx) in currentVariant!.patterns"
          :key="pIdx"
          class="variation-dot pattern-dot"
          :class="{ active: pIdx === patternIndex }"
          :title="p.patternName || `图案 ${pIdx + 1}`"
          @click="patternIndex = pIdx"
        >
          {{ pIdx + 1 }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
@import "../styles/Card.css";

.item-owned {
  background: #e8f5e9;
  border: 2px solid #4caf50;
}

.item-id {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.buy-price {
  color: #ff6b6b;
}

.sell-price {
  color: #51cf66;
}

.detail-center {
  justify-content: center !important;
  align-items: center;
}

.variants-section {
  background: #f0f9f0;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #c8e6c8;
  margin-top: 8px;
}

.variants-label {
  font-weight: 600;
  color: #4a9b4f;
  font-size: 0.85em;
  display: block;
  margin-bottom: 8px;
}

.variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.variation-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.variation-dot:hover {
  background: #c8c8c8;
  transform: scale(1.1);
}

.variation-dot.active {
  background: #4a9b4f;
  color: white;
}
</style>
