<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { joinArray } from '../utils/common';
import {
  getImgUrl,
  getItemTypeIcon,
  getItemSubtypeIcon,
  getSizeIcon,
  getSizeName,
} from '../services/dataService';
import { ItemModel } from '../models';
import BaseCard from './BaseCard.vue';
import ColorBlock from './ColorBlock.vue';
import SourceList from './SourceList.vue';
import { UI_TEXT } from '../constants';
import { Color } from '../types/item';
import { useItemDetailModal } from '../composables/useItemDetailModal';

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
// const displayName = computed(() => itemModel.getDisplayName());
const displayImages = computed(() => itemModel.getDisplayImages());
const displayCusCostStrs = computed(() => {
  return itemModel.getCostStrs();
});
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
    :class="{ 'recipe-bg': itemModel.canDIY }"
    :variant="itemModel.owned ? 'dark' : 'light'"
    :showCheckmark="itemModel.owned"
    :version="itemModel.version"
    :images="displayImages"
    :displayName="itemModel.name"
    :shape="'rounded'"
    @click="handleClick"
  >
    <div class="detail-row detail-center">
      <span class="detail-label"> ID: {{ displayId }} </span>
      <img
        v-if="itemModel.size"
        :src="getSizeIcon(itemModel.size)"
        :title="itemModel.sizeName"
        class="inline-icon"
      />
      <ColorBlock :colors="displayColors" :size="16" />
    </div>
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        <img
          :src="getItemTypeIcon(itemModel.type)"
          :alt="itemModel.typeName"
          :title="itemModel.typeName"
          class="inline-icon gray"
          loading="lazy" />
        <template v-if="itemModel.subtype">
          -
          <img
            :src="getItemSubtypeIcon(itemModel.type, itemModel.subtype)"
            class="inline-icon gray"
            loading="lazy"
          /> </template
      ></span>
    </div>
    <!-- <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value">{{ itemModel.sizeName }}</span>
    </div> -->
    <!-- <div v-if="itemModel.tag" class="detail-row">
      <span class="detail-label">标签</span>
      <span class="detail-value">{{ itemModel.tagName }}</span>
    </div> -->
    <div class="detail-row">
      <span class="detail-label">HHA分数</span>
      <span class="detail-value">{{ itemModel.hhaPoints || '--' }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">HHA主题</span>
      <span class="detail-value">{{ itemModel.hhaSeriesName }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">HHA场景</span>
      <span class="detail-value">
        {{ joinArray(itemModel.hhaConceptNames) }}
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">HHA套组</span>
      <span class="detail-value">{{ itemModel.hhaSetName }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">HHA分类</span>
      <span class="detail-value">{{ itemModel.hhaCategoryName }}</span>
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
      <span class="detail-value highlight">
        <template v-if="itemModel.buyPrices.length > 0">
          <div
            v-for="(priceStr, index) in itemModel.buyPriceStrs"
            :key="index"
            v-html="priceStr"
          ></div>
        </template>
        <div v-else>不可购买</div>
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value highlight" v-html="itemModel.sellPriceStr"> </span>
    </div>

    <div v-if="itemModel.canCustomize" class="variants-section">
      <span class="variants-label">
        <img
          :src="getImgUrl('img/icon/icon_cus_v.png')"
          :alt="itemModel.typeName"
          :title="itemModel.typeName"
          class="inline-icon"
          loading="lazy"
        />
        {{ itemModel.vTitleName }} - {{ itemModel.currentVariant?.name }}
      </span>
      <span class="variants-label"></span>
      <div class="variants-list">
        <span
          v-for="(vg, vIdx) in itemModel.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{
            active: vIdx === variantIndex,
            blue: itemModel.isVariantCusOnlyByCyrus(vIdx),
          }"
          :title="vg.name || `${itemModel.vTitleName} ${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          {{ vIdx + 1 }}
        </span>
      </div>

      <span v-if="itemModel.hasPatterns" class="variants-label">
        <img
          :src="getImgUrl('img/icon/icon_cus_p.png')"
          :alt="itemModel.typeName"
          :title="itemModel.typeName"
          class="inline-icon"
          loading="lazy"
        />
        {{ itemModel.pTitleName }} - {{ itemModel.currentPattern?.name }}
      </span>
      <div v-if="itemModel.hasPatterns" class="variants-list">
        <span
          v-for="(p, pIdx) in currentVariant!.patterns"
          :key="pIdx"
          class="variation-dot"
          :class="{
            active: pIdx === patternIndex,
          }"
          :title="p.name || `${itemModel.pTitleName} ${pIdx + 1}`"
          @click="patternIndex = pIdx"
        >
          {{ pIdx + 1 }}
        </span>
      </div>
      <div class="detail-row" style="border: 2px #ffea9e solid; background: #fff9e6">
        <span class="detail-label">花费</span>
        <span class="detail-value">
          <div v-for="(str, index) in displayCusCostStrs" :key="index" v-html="str"></div>
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../styles/card-styles';
.variants-section {
  background: #fff9e6;
  border-radius: var(--border-radius-xl);
  padding: 8px;
  border: 2px solid #ffea9e;
  margin-top: 8px;
}

.variants-label {
  font-weight: 600;
  color: #b07a00;
  font-size: 0.85em;
  display: block;

  &.blue {
    color: #0b4f80;
  }
}

.variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px;
}

.variation-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff9e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #b07a00;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px #ffea9e solid;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    background: #ffea9e;
  }

  &.blue {
    background: #e6f4ff;
    color: #0b4f80;
    border-color: #bfe8ff;
  }

  &.blue.active {
    background: #2b8cff;
    color: #fff;
    border-color: #1976d2;
  }
}

/* Pink theme for variants-section */
.variants-section--pink {
  background: #fff0f6;
  border-color: #ffd0e6;
}

.variants-section--pink .variants-label {
  color: #b0005a;
}

.variants-section--pink .variation-dot {
  background: #fff0f6;
  color: #b0005a;
  border-color: #ffd0e6;
}

.variants-section--pink .variation-dot:hover {
  transform: scale(1.1);
}

.variants-section--pink .variation-dot.active {
  background: #ffd0e6;
}

.variants-section--pink .variation-dot.blue {
  background: #fff0f6;
  color: #7a003a;
  border-color: #ffd6e8;
}

.variants-section--pink .variation-dot.blue.active {
  background: #ff4d9e;
  color: #fff;
  border-color: #e60073;
}
</style>
