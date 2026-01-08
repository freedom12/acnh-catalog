<script setup lang="ts">
import { ref, computed } from "vue";
import type { NPC } from "../types/npc";
import BaseCard from "./BaseCard.vue";
import {
  getGenderIcon,
  getGenderName,
  getConstellation,
  getConstellationIcon,
  getConstellationName,
} from "../services/dataService";

const props = defineProps<{
  data: NPC;
}>();
const currentImageIndex = ref(0);
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? "circle" : "rounded"
);

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
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
      <h3
        class="card-name"
        :style="{ color: props.data.nameColor || '#e67e22' }"
      >
        {{ props.data.name }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      <span class="detail-label">
        <img
          :src="getGenderIcon(props.data.gender)"
          :alt="getGenderName(props.data.gender)"
          class="inline-icon"
        />
        {{ props.data.id }}
      </span>
    </span>
    <span class="detail-row">
      <span class="detail-label">生日</span>
      <span class="detail-value">
        {{ props.data.birthday }}
        <img
          class="inline-icon"
          :src="getConstellationIcon(getConstellation(props.data.birthday))"
          :alt="getConstellationName(getConstellation(props.data.birthday))"
          :title="getConstellationName(getConstellation(props.data.birthday))"
        />
      </span>
    </span>
  </BaseCard>
</template>
