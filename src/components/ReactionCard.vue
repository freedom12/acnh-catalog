<script setup lang="ts">
import type { Reaction } from '../types/reaction';
import { UI_TEXT } from '../constants';
import { getChineseText, joinArray } from '../utils/common';
import BaseCard from './BaseCard.vue';

interface Props {
  data: Reaction;
}

const props = defineProps<Props>();

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--purple"
    :version="props.data.versionAdded"
    :image="props.data.image"
    :displayName="getChineseText(props.data)"
    @click="handleClick"
  >
    <div class="detail-row">
      <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
      <span class="detail-value">{{ joinArray(props.data.source) }}</span>
    </div>
    <div class="detail-row" v-if="props.data.seasonEvent">
      <span class="detail-label">{{ UI_TEXT.LABELS.EVENT }}</span>
      <span class="detail-value">{{ props.data.seasonEvent }}</span>
    </div>
  </BaseCard>
</template>