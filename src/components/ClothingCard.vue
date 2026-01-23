<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { joinArray } from '../utils/common';
import {
  getCatalogIcon,
  getImgUrl,
  getItemTypeIcon,
  getSizeIcon,
} from '../services/dataService';
import { ItemModel } from '../models';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import ColorBlock from './ColorBlock.vue';
import SourceList from './SourceList.vue';
import ActivityList from './ActivityList.vue';
import { UI_TEXT } from '../constants';
import { Catalog, Color } from '../types/item';
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
const icon = computed(() => {
  if (itemModel.hasIcon) {
    return itemModel.icon;
  }
  return '';
});
const displayId = computed(() => itemModel.getDisplayId());
const displayColors = computed(() => itemModel.getDisplayColors());
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
    colorClass="card--pink"
    :class="{ 'recipe-bg': itemModel.canDIY }"
    variant="dark"
    :version="itemModel.version"
    :images="displayImages"
    :icon="icon"
    :displayName="itemModel.name"
    :shape="'rounded'"
    :getSelectId="() => itemModel.variantGroups.flatMap(variant => variant.map(pattern => pattern.id).filter(id => id !== undefined))"
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
      <ColorBlock :colors="displayColors" :size="16" />
      <InlineIcon
        v-if="itemModel.catalog !== Catalog.NotInCatalog"
        :src="getCatalogIcon(itemModel.catalog)"
        :title="itemModel.catalogName"
        gray
      />
      <InlineIcon
        v-if="itemModel.canDIY"
        :src="getImgUrl('img/icon/diy_1.png')"
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
    </DetailRow>
    <DetailRow label="HHA分数" :value="itemModel.hhaPoints || '--'" />
    <DetailRow label="服饰风格" :value="joinArray(itemModel.clothingStyleNames)" />
    <DetailRow label="服饰主题" :value="joinArray(itemModel.clothingThemeNames)" />
    <DetailRow label="活动">
      <ActivityList :activitys="itemModel.activitys" />
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.SOURCE" class="source-row">
      <SourceList :sources="itemModel.sources" :sourceNotes="itemModel.sourceNotes" />
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

    <div
      v-if="itemModel.hasVariations"
      :class="['panel', itemModel.canCustomize ? 'panel--yellow' : 'panel--pink']"
    >
      <span class="panel-title">
        {{ itemModel.getVName() }}
      </span>
      <div class="dot-selector">
        <span
          v-for="(_, vIdx) in itemModel.variantGroups"
          :key="vIdx"
          :class="[
            'dot-item',
            itemModel.canCustomize ? 'dot-item--yellow' : 'dot-item--pink',
            { 'dot-item--active': vIdx === variantIndex }
          ]"
          :title="itemModel.getVName(vIdx) || `${vIdx + 1}`"
          @click="variantIndex = vIdx"
        >
          {{ vIdx + 1 }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
// 使用全局样式
</style>
