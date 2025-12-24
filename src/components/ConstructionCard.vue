<script setup lang="ts">
import type { Construction } from '../types/construction';
import { getChineseText, formatPrice, joinArray } from '../utils/common';
import BaseCard from './BaseCard.vue';

interface Props {
  data: Construction;
}

const props = defineProps<Props>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--brown"
    :version="props.data.versionAdded"
    :image="props.data.image"
    :displayName="getChineseText(props.data)"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">分类</span>
      <span class="detail-value">{{ props.data.category }}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">售价</span>
      <span class="detail-value price">{{ formatPrice(props.data.buy) }} 铃钱</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">来源</span>
      <span class="detail-value">{{ joinArray(props.data.source) }}</span>
    </div>
  </BaseCard>
</template>