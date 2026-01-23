<script setup lang="ts">
import BaseCard from './BaseCard.vue';
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
    <div class="detail-row detail-center">
      <span class="detail-label">ID: {{ props.data.id }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value"
        >{{ getPlantTypeName(props.data.type) }}
        <img
          :src="getPlantTypeIcon(props.data.type)"
          :alt="getPlantTypeName(props.data.type)"
          class="inline-icon gray"
        />
      </span>
    </div>
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
      <span class="detail-value highlight" v-html="getPriceWithIcon(props.data.sell)">
      </span>
    </div>
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

<style scoped lang="scss">
// 使用全局样式
</style>
