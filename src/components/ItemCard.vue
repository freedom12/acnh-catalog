<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { joinArray } from "../utils/common";
import { ItemModel } from "../models";
import BaseCard from "./BaseCard.vue";
import ColorBlock from "./ColorBlock.vue";
import SourceList from "./SourceList.vue";
import { UI_TEXT } from "../constants";
import { Color } from "../types/item";
import { useItemDetailModal } from "../composables/useItemDetailModal";

const props = defineProps<{
  data: ItemModel;
  colorFilter?: Color;
}>();

const { openModal } = useItemDetailModal();

const itemModel = props.data;
const variantIndex = computed({
  get: () => itemModel.variantIndex,
  set: (val: number) => (itemModel.variantIndex = val),
});

const patternIndex = computed({
  get: () => itemModel.patternIndex,
  set: (val: number) => (itemModel.patternIndex = val),
});

const currentVariant = computed(() => itemModel.currentVariant);
const displayId = computed(() => itemModel.getDisplayId());
const displayColors = computed(() => itemModel.getDisplayColors());
const displayName = computed(() => itemModel.getDisplayName());
const displayImages = computed(() => itemModel.getDisplayImages());

const applyColorFilter = () => {
  if (props.colorFilter !== undefined && itemModel.hasVariations) {
    const match = itemModel.findVariantByColor(props.colorFilter);
    if (match) {
      variantIndex.value = match.variantIndex;
      patternIndex.value = match.patternIndex;
    }
  }
};
const resetAndApplyColorFilter = () => {
  variantIndex.value = 0;
  patternIndex.value = 0;
  applyColorFilter();
};
onMounted(() => {
  applyColorFilter();
});

watch(() => props.colorFilter, resetAndApplyColorFilter);
const handleClick = () => {
  openModal(itemModel.id);
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    :class="{ 'item-owned': itemModel.owned }"
    :version="itemModel.version"
    :images="displayImages"
    :displayName="displayName"
    :shape="'rounded'"
    @click="handleClick"
  >
    <span class="detail-row detail-center">
      ID: {{ displayId }}
      <ColorBlock
        v-if="displayColors.length > 0"
        :colors="displayColors"
        :size="16"
      />
    </span>
    <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value">{{ itemModel.sizeName }}</span>
    </div>
    <!-- <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">标签</span>
      <span class="detail-value">{{ itemModel.tagName }}</span>
    </div> -->
    <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">HHA分数</span>
      <span class="detail-value">{{ itemModel.hhaPoints || "--" }}</span>
    </div>
    <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">HHA主题</span>
      <span class="detail-value">{{ itemModel.hhaSeriesName }}</span>
    </div>
    <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">HHA场景</span>
      <span class="detail-value">
        {{ joinArray(itemModel.hhaConceptNames) }}
      </span>
    </div>
    <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">HHA套组</span>
      <span class="detail-value">{{ itemModel.hhaSetName }}</span>
    </div>
    <div v-if="!itemModel.isClothing" class="detail-row">
      <span class="detail-label">HHA分类</span>
      <span class="detail-value">{{ itemModel.hhaCategoryName }}</span>
    </div>

    <div v-if="itemModel.isClothing" class="detail-row">
      <span class="detail-label">服饰风格</span>
      <span class="detail-value">{{
        joinArray(itemModel.clothingStyleNames)
      }}</span>
    </div>
    <div v-if="itemModel.isClothing" class="detail-row">
      <span class="detail-label">服饰主题</span>
      <span class="detail-value">{{
        joinArray(itemModel.closingThemeNames)
      }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">季节/庆典</span>
      <span class="detail-value">{{ itemModel.activityName }}</span>
    </div>
    <div class="detail-row source-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="itemModel.sources"
        :sourceNotes="itemModel.sourceNotes"
      />
    </div>
    <div class="detail-row">
      <span class="detail-label">购买</span>
      <span class="detail-value price">
        <template v-if="itemModel.buyPrices.length > 0">
          <div v-for="(priceStr, index) in itemModel.buyPriceStrs" :key="index">
            {{ priceStr }}
          </div>
        </template>
        <div v-else>不可购买</div>
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value price">
        {{ itemModel.sellPriceStr }}
      </span>
    </div>
    <div v-if="itemModel.hasVariations" class="variants-section variant-row">
      <span class="variants-label">{{ itemModel.vTitleName }}</span>
      <div class="variants-list">
        <span
          v-for="(vg, vIdx) in itemModel.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{ active: vIdx === variantIndex }"
          :title="vg.name || `${itemModel.vTitleName} ${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          {{ vIdx + 1 }}
        </span>
      </div>
    </div>
    <div v-if="itemModel.hasPatterns" class="variants-section pattern-row">
      <span class="variants-label">{{ itemModel.pTitleName }}</span>
      <div class="variants-list">
        <span
          v-for="(p, pIdx) in currentVariant!.patterns"
          :key="pIdx"
          class="variation-dot pattern-dot"
          :class="{ active: pIdx === patternIndex }"
          :title="p.name || `${itemModel.pTitleName} ${pIdx + 1}`"
          @click="patternIndex = pIdx"
        >
          {{ pIdx + 1 }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
@import "../styles/card-styles.css";

.item-owned {
  background: var(--gradient-success-light);
  border: 2px solid var(--success-color);
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
