<script setup lang="ts">
import { ref, computed } from 'vue';
import { UI_TEXT } from '../constants';
import type { Fossil } from '../types/fossil';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
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
    :getSelectId="() => props.data.parts.map((part) => part.id)"
    :shape="'rounded'"
    @image-index-changed="handleImageIndexChanged"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name">{{ props.data.name }}</h3>
    </template>
    <DetailRow label="年代" :value="getFossilTypeName(props.data.type)" />
    <DetailRow label="描述" :value="props.data.desc" layout="full" />
    <DetailRow label="部件数量" :value="props.data.parts.length" />
    <DetailRow label="尺寸" :value="getSizeWithIcon(currentSize)" />
    <DetailRow
      :label="UI_TEXT.LABELS.PRICE"
      :value="getPriceWithIcon(currentPrice)"
      variant="value-highlight"
    />
  </BaseCard>
</template>
