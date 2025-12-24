<script setup lang="ts">
import type { NPC } from '../types/npc';
import { ENTITY_ICONS } from '../constants';
import { getChineseText, lightenColor } from '../utils/common';
import BaseCard from './BaseCard.vue';

interface Props {
  data: NPC;
}

const props = defineProps<Props>();

// 获取性别emoji
const getGenderIcon = (gender: string): string => {
  return gender === 'Male' ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
};

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, '_blank');
};
</script>

<template>
  <BaseCard
    colorClass="card--orange-dark"
    :version="props.data.versionAdded"
    :image="props.data.iconImage"
    :displayName="getChineseText(props.data)"
    :style="{
      background: (props.data.bubbleColor || '#ffe082'),
      border: '3px solid ' + lightenColor(props.data.bubbleColor || '#ffe082', -0.5)
    }"
    @click="handleClick"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.nameColor || '#e67e22' }">{{ getChineseText(props.data) }}</h3>
    </template>
    <span class="detail-row detail-center">
      {{ getGenderIcon(props.data.gender) }} {{ props.data.npcId }}
    </span>
    <span class="detail-row detail-center">
      🎂 {{ props.data.birthday }}
    </span>
  </BaseCard>
</template>