<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import type { Plant } from '../types/plant';
import { UI_TEXT } from '../constants';
import {
  getPlantTypeName,
  getPlantTypeIcon,
  getPriceWithIcon,
} from '../services/dataService';
import ItemIcon from './ItemIcon.vue';
import { computed, onMounted } from 'vue';
import { useItemsData } from '../composables/useItemsData';

const props = defineProps<{
  data: Plant;
}>();

const { loadData: loadItemsData } = useItemsData();
onMounted(() => {
  loadItemsData();
});

const showProduct = computed(() => !!props.data.product);
const showSeeds = computed(() => !!props.data.seeds);

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--green"
    variant="dark"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="'rounded'"
    @click="handleClick"
  >
    <DetailRow :label="`ID: ${props.data.id}`" layout="center" />
    <DetailRow label="分类">
      {{ getPlantTypeName(props.data.type) }}
      <InlineIcon
        :src="getPlantTypeIcon(props.data.type)"
        :alt="getPlantTypeName(props.data.type)"
        gray
      />
    </DetailRow>
    <DetailRow
      :label="UI_TEXT.LABELS.PRICE"
      :value="getPriceWithIcon(props.data.sell)"
      variant="value-highlight"
    />
    <div
      v-if="showProduct || showSeeds"
      :class="['icon-grid', { 'icon-grid--cols-2': showProduct && showSeeds }]"
    >
      <div v-if="showSeeds" class="icon-grid-item">
        <ItemIcon :itemId="props.data.seeds!" :size="72" />
        <span class="icon-grid-label">种子</span>
      </div>
      <div v-if="showProduct" class="icon-grid-item">
        <ItemIcon :itemId="props.data.product!" :size="72" />
        <span class="icon-grid-label">产出</span>
      </div>
    </div>
  </BaseCard>
</template>
