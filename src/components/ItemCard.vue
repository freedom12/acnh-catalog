<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { joinArray } from '../utils/common';
import {
  getImgUrl,
  getItemTypeIcon,
  getItemSubtypeIcon,
  getSizeIcon,
  getCatalogIcon,
} from '../services/dataService';
import { ItemModel } from '../models';
import BaseCard from './BaseCard.vue';
import ColorBlock from './ColorBlock.vue';
import ActivityList from './ActivityList.vue';
import SourceList from './SourceList.vue';
import { UI_TEXT } from '../constants';
import { Catalog, Color } from '../types/item';
import { useItemDetailModal } from '../composables/useItemDetailModal';
import TooltipWrapper from './TooltipWrapper.vue';

const props = defineProps<{
  data: ItemModel;
  colorFilter?: Color;
}>();

const { openModal } = useItemDetailModal();

const itemModel = props.data;
const isHhaExpanded = ref(false);
const variantIndex = computed({
  get: () => itemModel.variantIndex,
  set: (val: number) => (itemModel.variantIndex = val),
});

const patternIndex = computed({
  get: () => itemModel.patternIndex,
  set: (val: number) => (itemModel.patternIndex = val),
});

const icon = computed(() => {
  if (itemModel.hasIcon) {
    return itemModel.icon;
  }
  return '';
});
const currentVariant = computed(() => itemModel.currentVariant);
const displayId = computed(() => itemModel.getDisplayId());
const displayColors = computed(() => itemModel.getDisplayColors());
// const displayName = computed(() => itemModel.getDisplayName());
const displayImages = computed(() => itemModel.getDisplayImages());
const displayCusCostStrs = computed(() => {
  return itemModel.cusCostStrs;
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
const toggleHhaExpanded = () => {
  isHhaExpanded.value = !isHhaExpanded.value;
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    :class="{ 'recipe-bg': itemModel.canDIY }"
    variant="dark"
    :showCheckmark="itemModel.owned"
    :version="itemModel.version"
    :images="displayImages"
    :icon="icon"
    :displayName="itemModel.name"
    :shape="'rounded'"
    :getSelectId="() => itemModel.id"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- <div class="detail-row detail-center">
      <span class="detail-label">{{ itemModel.raw.ict || '' }}</span>
    </div> -->

    <div class="detail-row detail-center">
      <span class="detail-label"> ID: {{ displayId }} </span>
      <img
        v-if="itemModel.size"
        :src="getSizeIcon(itemModel.size)"
        :title="itemModel.sizeName"
        class="inline-icon"
      />
      <ColorBlock v-if="displayColors.length > 0" :colors="displayColors" :size="16" />
      <img
        v-if="itemModel.catalog !== Catalog.NotInCatalog"
        :src="getCatalogIcon(itemModel.catalog)"
        :title="itemModel.catalogName"
        class="inline-icon gray"
      />
      <img
        v-if="itemModel.canDIY"
        :src="getImgUrl(`img/icon/diy_${itemModel.diyType}.png`)"
        title="可DIY"
        class="inline-icon"
      />
    </div>
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">
        {{ itemModel.typeNameShort }}
        <img
          :src="getItemTypeIcon(itemModel.type)"
          :alt="itemModel.typeName"
          :title="itemModel.typeName"
          class="inline-icon gray"
          loading="lazy"
        />
        <template v-if="itemModel.tag">
          -
          {{ itemModel.tagName }}
          <img
            v-if="itemModel.subtype"
            :src="getItemSubtypeIcon(itemModel.type, itemModel.subtype)"
            :alt="itemModel.tagName"
            :title="itemModel.tagName"
            class="inline-icon gray"
            loading="lazy"
          />
        </template>
      </span>
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
      <span class="detail-label">活动</span>
      <ActivityList class="detail-value" :activitys="itemModel.activitys" />
    </div>
    <div class="detail-row source-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <SourceList
        class="detail-value"
        :sources="itemModel.sources"
        :sourceNotes="itemModel.sourceNotes"
      />
    </div>

    <!-- <div v-if="itemModel.isStackable" class="detail-row">
      <span class="detail-label"> 堆叠数量 </span>
      <span class="detail-value">{{ itemModel.stackSize }}</span>
    </div>
    <div v-if="itemModel.isFood" class="detail-row">
      <span class="detail-label"> 食物能量 </span>
      <span class="detail-value">
        {{ itemModel.foodPower }}
        <img
          :src="getImgUrl('img/icon/food_power.png')"
          title="能量"
          class="inline-icon"
        />
      </span>
    </div> -->
    <div v-if="itemModel.isHandable" class="detail-row">
      <span class="detail-label"> 使用次数 </span>
      <span class="detail-value">{{
        itemModel.useTimes && itemModel.useTimes > 0 ? itemModel.useTimes : '永久'
      }}</span>
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

    <div v-if="itemModel.hhaPoints" class="hha-section">
      <div class="hha-title" @click="toggleHhaExpanded">
        <img :src="getImgUrl('img/icon/hhp.png')" class="inline-icon" loading="lazy" />
        快乐家协会
        <img :src="getImgUrl('img/icon/hhp.png')" class="inline-icon" loading="lazy" />
        <!-- <span class="toggle-icon">{{ isHhaExpanded ? '▼' : '▶' }}</span> -->
      </div>
      <div v-if="isHhaExpanded" class="hha-content">
        <div class="detail-row">
          <span class="detail-label">分数</span>
          <span class="detail-value">{{ itemModel.hhaPoints || '--' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">
            <TooltipWrapper tooltip="摆放3件或以上相同分类的家具，每件加500分">
              分类
            </TooltipWrapper>
          </span>
          <span class="detail-value">{{ itemModel.hhaCategoryName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">
            <TooltipWrapper tooltip="摆放4件或以上相同主题的家具，每件加1000分">
              主题
            </TooltipWrapper>
          </span>
          <span class="detail-value">{{ itemModel.hhaSeriesName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">
            <TooltipWrapper tooltip="摆放全部套组中的家具，每件加800分">
              套组
            </TooltipWrapper>
          </span>
          <span class="detail-value">{{ itemModel.hhaSetName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">场景</span>
          <span class="detail-value">
            {{ joinArray(itemModel.hhaConceptNames) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="itemModel.canCustomize" class="variants-section">
      <span
        v-if="itemModel.hasVariations"
        class="variants-label"
        :class="{
          // blue: !itemModel.canCustomizeVariantBySelf,
        }"
      >
        <img
          :src="getImgUrl('img/icon/icon_cus_v.png')"
          class="inline-icon"
          loading="lazy"
        />
        {{ itemModel.vTitleName }} - {{ itemModel.getVName() }}
      </span>
      <div v-if="itemModel.hasVariations" class="variants-list">
        <span
          v-for="(_, vIdx) in itemModel.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{
            active: vIdx === variantIndex,
            blue: itemModel.isCustomizeVariantOnlyByCyrus(vIdx),
          }"
          :title="itemModel.getVName(vIdx) || `${itemModel.vTitleName} ${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          <img
            v-if="itemModel.indexCustomizeVariantOnlyByCyrus === vIdx"
            :src="getImgUrl('img/icon/icon_cus_v_cyrus.png')"
            class="inline-icon"
            loading="lazy"
          />
          <template v-if="itemModel.indexCustomizeVariantOnlyByCyrus !== vIdx">
            {{ vIdx + 1 }}
          </template>
        </span>
      </div>

      <span v-if="itemModel.hasPatterns" class="variants-label">
        <img
          :src="getImgUrl('img/icon/icon_cus_p.png')"
          class="inline-icon"
          loading="lazy"
        />
        {{ itemModel.pTitleName }} - {{ itemModel.getPName() }}
      </span>
      <div v-if="itemModel.hasPatterns" class="variants-list">
        <span
          v-for="(_, pIdx) in currentVariant!"
          :key="pIdx"
          class="variation-dot"
          :class="{
            active: pIdx === patternIndex,
          }"
          :title="itemModel.getPName(pIdx) || `${itemModel.pTitleName} ${pIdx + 1}`"
          @click="patternIndex = pIdx"
        >
          {{ pIdx + 1 }}
        </span>
        <span
          v-if="itemModel.canCustomizePatternWithSableDesign"
          class="variation-dot"
          title="可以使用麻儿的设计图案"
        >
          <img
            :src="getImgUrl('img/icon/icon_cus_p_1.png')"
            class="inline-icon"
            loading="lazy"
          />
        </span>
        <span
          v-if="itemModel.canCustomizePatternWithMyDesign"
          class="variation-dot"
          title="可以使用我的设计图案"
        >
          <img
            :src="getImgUrl('img/icon/icon_cus_p_2.png')"
            class="inline-icon"
            loading="lazy"
          />
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

.hha-section {
  border-radius: var(--border-radius-xl);
  background: #ffeaea;
  padding: 8px;
  border: 2px solid #fcc;
  margin-top: 8px;
}

.hha-content {
  background: #fff6f6;
  padding: 4px;
  border: 2px solid #fcc;
  border-radius: var(--border-radius-lg);
}

.hha-content .detail-row:not(:last-child) {
  position: relative;
}

.hha-content .detail-row:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #fcc;
  border-radius: 1px;
}

.hha-content .detail-row {
  border-radius: 0;
}

.hha-section .detail-row {
  background-color: transparent;
}

.hha-row {
  display: flex;
  gap: 8px;
}

.hha-row .detail-row {
  flex: 1;
}

.hha-title {
  font-weight: 600;
  color: #8b0000;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 4px;
  cursor: pointer;
}

.toggle-icon {
  font-size: 0.7em;
  color: #666;
  transition: transform 0.2s ease;
  margin: 0 2px;
}
</style>
