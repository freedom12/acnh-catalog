<script setup lang="ts">
import { ref, computed } from "vue";
import type { NPC } from "../types/npc";
import BaseCard from "./BaseCard.vue";
import { getGenderIcon } from "../services/dataService";

interface Props {
  data: NPC;
}

const props = defineProps<Props>();
const currentImageIndex = ref(0);
const currentShape = computed(() => currentImageIndex.value === 0 ? 'circle' : 'rounded');

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
      {{ getGenderIcon(props.data.gender) }} {{ props.data.id }}
    </span>
    <span class="detail-row detail-center"> 🎂 {{ props.data.birthday }} </span>
  </BaseCard>
</template>
