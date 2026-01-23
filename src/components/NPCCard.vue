<script setup lang="ts">
import { ref, computed } from 'vue';
import type { NPC } from '../types/npc';
import BaseCard from './BaseCard.vue';
import DetailRow from './common/DetailRow.vue';
import InlineIcon from './common/InlineIcon.vue';
import ItemIcon from './ItemIcon.vue';
import {
  getGenderIcon,
  getGenderName,
  getConstellation,
  getConstellationIcon,
  getConstellationName,
  getHobbyName,
} from '../services/dataService';

const props = defineProps<{
  data: NPC;
}>();
const currentImageIndex = ref(0);
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? 'circle' : 'rounded'
);

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, '_blank');
};

const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};
</script>

<template>
  <BaseCard
    :colorTheme="props.data.bubbleColor || '#ffe082'"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="currentShape"
    variant="dark"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.nameColor || '#e67e22' }">
        {{ props.data.name }}
      </h3>
    </template>
    <DetailRow layout="center">
      {{ props.data.id }}
      <InlineIcon
        :src="getGenderIcon(props.data.gender)"
        :alt="getGenderName(props.data.gender)"
      />
    </DetailRow>
    <DetailRow label="生日">
      {{ props.data.birthday }}
      <InlineIcon
        :src="getConstellationIcon(getConstellation(props.data.birthday))"
        :alt="getConstellationName(getConstellation(props.data.birthday))"
        :title="getConstellationName(getConstellation(props.data.birthday))"
      />
    </DetailRow>
    <DetailRow label="爱好" :value="getHobbyName(props.data.hobby)" />
    <div class="icon-grid icon-grid--inline">
      <ItemIcon v-if="props.data.umbrella" :itemId="props.data.umbrella" :size="60" />
      <ItemIcon v-if="props.data.umbrellaHHP" :itemId="props.data.umbrellaHHP" :size="60" />
    </div>
  </BaseCard>
</template>
