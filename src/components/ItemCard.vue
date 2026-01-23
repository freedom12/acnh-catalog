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
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
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
    :version="itemModel.version"
    :images="displayImages"
    :icon="icon"
    :displayName="itemModel.name"
    :shape="'rounded'"
    :getSelectId="() => itemModel.id"
    v-bind="$attrs"
    @click="handleClick"
  >
    <DetailRow layout="center">
      ID: {{ displayId }}
      <InlineIcon
        v-if="itemModel.size"
        :src="getSizeIcon(itemModel.size)"
        :title="itemModel.sizeName"
      />
      <ColorBlock v-if="displayColors.length > 0" :colors="displayColors" :size="16" />
      <InlineIcon
        v-if="itemModel.catalog !== Catalog.NotInCatalog"
        :src="getCatalogIcon(itemModel.catalog)"
        :title="itemModel.catalogName"
        gray
      />
      <InlineIcon
        v-if="itemModel.canDIY"
        :src="getImgUrl(`img/icon/diy_${itemModel.diyType}.png`)"
        title="可DIY"
      />
    </DetailRow>
    <DetailRow label="分类">
      {{ itemModel.typeNameShort }}
      <InlineIcon
        :src="getItemTypeIcon(itemModel.type)"
        :alt="itemModel.typeName"
        :title="itemModel.typeName"
        gray
      />
      <template v-if="itemModel.tag">
        - {{ itemModel.tagName }}
        <InlineIcon
          v-if="itemModel.subtype"
          :src="getItemSubtypeIcon(itemModel.type, itemModel.subtype)"
          :alt="itemModel.tagName"
          :title="itemModel.tagName"
          gray
        />
      </template>
    </DetailRow>
    <DetailRow label="活动">
      <ActivityList :activitys="itemModel.activitys" />
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.SOURCE" class="source-row">
      <SourceList :sources="itemModel.sources" :sourceNotes="itemModel.sourceNotes" />
    </DetailRow>
    <DetailRow v-if="itemModel.isHandable" label="使用次数">
      {{ itemModel.useTimes && itemModel.useTimes > 0 ? itemModel.useTimes : '永久' }}
    </DetailRow>
    <DetailRow label="购买" variant="value-highlight">
      <template v-if="itemModel.buyPrices.length > 0">
        <div
          v-for="(priceStr, index) in itemModel.buyPriceStrs"
          :key="index"
          v-html="priceStr"
        ></div>
      </template>
      <div v-else>不可购买</div>
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.PRICE" :value="itemModel.sellPriceStr" variant="value-highlight" />

    <div v-if="itemModel.hhaPoints" class="panel panel--red">
      <div class="panel-header" @click="toggleHhaExpanded">
        <span class="panel-title">
          <InlineIcon :src="getImgUrl('img/icon/hhp.png')" />
          快乐家协会
        </span>
        <span class="panel-toggle">{{ isHhaExpanded ? '▼' : '▶' }}</span>
      </div>
      <div v-if="isHhaExpanded" class="panel-content">
        <div class="panel-inner">
          <DetailRow label="分数" :value="itemModel.hhaPoints || '--'" />
          <DetailRow label="分类" :value="itemModel.hhaCategoryName">
            <template #label>
              <TooltipWrapper tooltip="摆放3件或以上相同分类的家具，每件加500分">
                分类
              </TooltipWrapper>
            </template>
          </DetailRow>
          <DetailRow label="主题" :value="itemModel.hhaSeriesName">
            <template #label>
              <TooltipWrapper tooltip="摆放4件或以上相同主题的家具，每件加1000分">
                主题
              </TooltipWrapper>
            </template>
          </DetailRow>
          <DetailRow label="套组" :value="itemModel.hhaSetName">
            <template #label>
              <TooltipWrapper tooltip="摆放全部套组中的家具，每件加800分">
                套组
              </TooltipWrapper>
            </template>
          </DetailRow>
          <DetailRow label="场景" :value="joinArray(itemModel.hhaConceptNames)" />
        </div>
      </div>
    </div>

    <div v-if="itemModel.canCustomize" class="panel panel--yellow">
      <span v-if="itemModel.hasVariations" class="panel-title">
        <InlineIcon :src="getImgUrl('img/icon/icon_cus_v.png')" />
        {{ itemModel.vTitleName }} - {{ itemModel.getVName() }}
      </span>
      <div v-if="itemModel.hasVariations" class="dot-selector">
        <span
          v-for="(_, vIdx) in itemModel.variantGroups"
          :key="vIdx"
          class="dot-item dot-item--yellow"
          :class="{
            'dot-item--active': vIdx === variantIndex,
            'dot-item--blue': itemModel.isCustomizeVariantOnlyByCyrus(vIdx),
          }"
          :title="itemModel.getVName(vIdx) || `${itemModel.vTitleName} ${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          <InlineIcon
            v-if="itemModel.indexCustomizeVariantOnlyByCyrus === vIdx"
            :src="getImgUrl('img/icon/icon_cus_v_cyrus.png')"
          />
          <template v-if="itemModel.indexCustomizeVariantOnlyByCyrus !== vIdx">
            {{ vIdx + 1 }}
          </template>
        </span>
      </div>

      <span v-if="itemModel.hasPatterns" class="panel-title">
        <InlineIcon :src="getImgUrl('img/icon/icon_cus_p.png')" />
        {{ itemModel.pTitleName }} - {{ itemModel.getPName() }}
      </span>
      <div v-if="itemModel.hasPatterns" class="dot-selector">
        <span
          v-for="(_, pIdx) in currentVariant!"
          :key="pIdx"
          class="dot-item dot-item--yellow"
          :class="{ 'dot-item--active': pIdx === patternIndex }"
          :title="itemModel.getPName(pIdx) || `${itemModel.pTitleName} ${pIdx + 1}`"
          @click="patternIndex = pIdx"
        >
          {{ pIdx + 1 }}
        </span>
        <span
          v-if="itemModel.canCustomizePatternWithSableDesign"
          class="dot-item dot-item--yellow"
          title="可以使用麻儿的设计图案"
        >
          <InlineIcon :src="getImgUrl('img/icon/icon_cus_p_1.png')" />
        </span>
        <span
          v-if="itemModel.canCustomizePatternWithMyDesign"
          class="dot-item dot-item--yellow"
          title="可以使用我的设计图案"
        >
          <InlineIcon :src="getImgUrl('img/icon/icon_cus_p_2.png')" />
        </span>
      </div>
      <DetailRow label="花费" variant="bg-highlight">
        <div v-for="(str, index) in displayCusCostStrs" :key="index" v-html="str"></div>
      </DetailRow>
    </div>
  </BaseCard>
</template>
