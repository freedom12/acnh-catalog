<script setup lang="ts">
import { ref, computed } from 'vue';
import { UI_TEXT } from '../constants';
import type { Fossil } from '../types/fossil';
import BaseCard from './BaseCard.vue';
import { getPriceWithIcon, getSizeWithIcon } from '../services/dataService';
import { getFossilTypeName, ItemSize } from '../types';

const props = defineProps<{
  data: Fossil;
  selectable?: boolean;
  selectionKey?: string;
}>();

const currentPartIndex = ref(0);

const currentPrice = computed(() => {
  return props.data.parts[currentPartIndex.value]?.sell || 0;
});

const currentSize = computed(() => {
  return props.data.parts[currentPartIndex.value]?.size || ItemSize.The1X1;
});

const handleImageIndexChanged = (index: number) => {
  currentPartIndex.value = index;
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--orange"
    :version="1"
    :images="props.data.parts.map((part) => part.image)"
    :displayName="props.data.name"
    :selectionKey="selectionKey"
    :getSelectId="() => props.data.parts[0]?.id || props.data.rawName"
    :shape="'rounded'"
    @image-index-changed="handleImageIndexChanged"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name">{{ props.data.name }}</h3>
    </template>
    <div class="detail-row">
      <span class="detail-label">年代</span>
      <span class="detail-value">{{ getFossilTypeName(props.data.type) }}</span>
    </div>
    <div class="detail-row full">
      <span class="detail-label">描述</span>
      <span class="detail-value">{{ props.data.desc }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">部件数量</span>
      <span class="detail-value">{{ props.data.parts.length }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">尺寸</span>
      <span class="detail-value" v-html="getSizeWithIcon(currentSize)"> </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value highlight" v-html="getPriceWithIcon(currentPrice)"></span>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../styles/card-styles';
</style>
