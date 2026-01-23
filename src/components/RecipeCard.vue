<script setup lang="ts">
import { computed } from 'vue';
import type { Recipe } from '../types/recipe';
import { UI_TEXT } from '../constants';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import MaterialItem from './MaterialItem.vue';
import ActivityList from './ActivityList.vue';
import SourceList from './SourceList.vue';
import { processImageUrl } from '../utils/imageUtils';
import {
  getPriceWithIcon,
  getRecipeTypeName,
  getRecipeTypeIcon,
} from '../services/dataService';
import { useItemDetailModal } from '../composables/useItemDetailModal';
import type { Price } from '../types';

const props = defineProps<{
  data: Recipe;
  selectable?: boolean;
  selectionKey?: string;
}>();
const { openModal } = useItemDetailModal();
const handleClick = () => {
  openModal(props.data.itemId);
};

const colorMap: Record<string, string> = {
  red: '#ffcdd2',
  orange: '#ffe0b2',
  yellow: '#fff9c4',
  green: '#c8e6c9',
  blue: '#bbdefb',
  purple: '#e1bee7',
  pink: '#f8bbd0',
  brown: '#d7ccc8',
  beige: '#efebe9',
  white: '#fafafa',
  cream: '#fff8e1',
  gray: '#e0e0e0',
  'light gray': '#f5f5f5',
  'dark gray': '#bdbdbd',
  gold: '#fff9c4',
  silver: '#e0e0e0',
  brick: '#ffccbc',
  color_51: '#ffe0b2',
  color_52: '#fff9c4',
  color_53: '#c8e6c9',
  color_54: '#bbdefb',
  color_55: '#e1bee7',
  color_56: '#f8bbd0',
  color_60: '#d7ccc8',
  color_61: '#ffccbc',
  color_62: '#ffcdd2',
  color_63: '#dcedc8',
  color_64: '#b2dfdb',
  color_65: '#b2ebf2',
  color_66: '#d1c4e9',
  color_67: '#f0e4d7',
  color_68: '#fce4ec',
  color_69: '#e8eaf6',
  color_70: '#fff3e0',
  color_71: '#e0f2f1',
  color_72: '#fce4ec',
  color_73: '#ede7f6',
  color_74: '#f1f8e9',
  color_75: '#e8f5e9',
  color_76: '#fef5e7',
  color_77: '#eceff1',
};

const themeColor = computed(() => {
  const color = props.data.cardColor;
  return (color && color in colorMap ? colorMap[color] : colorMap['orange'])!;
});

const isShiny = computed(() => {
  const color = props.data.cardColor;
  return color === 'gold' || color === 'silver';
});

const buyPrices = computed((): Price[] => {
  let prices: Price[] = [];
  if (props.data.buy !== undefined && (props.data.buy as number) >= 0) {
    prices.push(props.data.buy);
  }
  if (props.data.exc !== undefined) {
    prices.push(props.data.exc);
  }
  return prices;
});

const buyPriceStrs = computed((): string[] => {
  return buyPrices.value
    .map((price) => getPriceWithIcon(price))
    .filter((str) => str !== '');
});
</script>

<template>
  <BaseCard
    :colorTheme="themeColor"
    :version="props.data.ver"
    :images="props.data.images.map(processImageUrl)"
    :displayName="props.data.name"
    :shiny="isShiny"
    :selectionKey="selectionKey"
    :getSelectId="() => props.data.id"
    variant="dark"
    class="recipe-bg"
    @click="handleClick"
  >
    <DetailRow label="分类">
      {{ getRecipeTypeName(props.data.type) }}
      <InlineIcon
        :src="getRecipeTypeIcon(props.data.type)"
        :alt="getRecipeTypeName(props.data.type)"
        gray
      />
    </DetailRow>
    <DetailRow label="活动">
      <ActivityList :activitys="props.data.acts" />
    </DetailRow>
    <DetailRow :label="UI_TEXT.LABELS.SOURCE">
      <SourceList :sources="props.data.source" :sourceNotes="props.data.sourceNotes" />
    </DetailRow>
    <DetailRow label="购买" variant="value-highlight">
      <template v-if="buyPrices.length > 0">
        <div v-for="(priceStr, index) in buyPriceStrs" :key="index" v-html="priceStr"></div>
      </template>
      <div v-else>不可购买</div>
    </DetailRow>
    <DetailRow
      :label="UI_TEXT.LABELS.PRICE"
      :value="getPriceWithIcon(props.data.sell) || '不可出售'"
      variant="value-highlight"
    />
    <div v-if="Object.keys(props.data.materials).length > 0" class="panel panel--orange">
      <span class="panel-title">所需材料</span>
      <div class="panel-content">
        <div class="icon-grid icon-grid--vertical">
          <MaterialItem
            v-for="[material, quantity] in props.data.materials"
            :key="material"
            :material="material"
            :quantity="quantity"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>
