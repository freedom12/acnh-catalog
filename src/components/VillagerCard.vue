<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Villager } from "../types/villager";
import { useItemsData } from "../composables/useItemsData";
import BaseCard from "./BaseCard.vue";
import ItemIcon from "./ItemIcon.vue";
import {
  getClothingStyleName,
  getGenderIcon,
  getHobbyName,
  getPersonalityName,
  getSpeciesName,
} from "../services/dataService";
import { joinArray, lightenColor } from "../utils/common";
import ColorBlock from "./ColorBlock.vue";

interface Props {
  data: Villager;
}

const props = defineProps<Props>();
const { loadData } = useItemsData();

onMounted(() => {
  loadData();
});

const currentImageIndex = ref(0);
const isFurnitureExpanded = ref(false);
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? "circle" : "rounded"
);

const furnitureList = computed(() => {
  return [
    ...props.data.furnitures,
    props.data.wallpaper,
    props.data.flooring,
    props.data.diyWorkbench,
    props.data.kitchenware,
  ];
});

const defaultItems = computed(() => {
  return [props.data.cloting, props.data.umbrella, props.data.song];
});

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.rawName}`, "_blank");
};

const handleImageIndexChanged = (index: number) => {
  currentImageIndex.value = index;
};

const toggleFurnitureExpanded = () => {
  isFurnitureExpanded.value = !isFurnitureExpanded.value;
};
</script>

<template>
  <BaseCard
    colorClass="card--green-dark"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="currentShape"
    :style="{
      background: props.data.bubbleColor,
      border: '3px solid ' + lightenColor(props.data.bubbleColor, -0.5),
    }"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.nameColor }">
        {{ props.data.name }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      {{ getGenderIcon(props.data.gender) }}
      {{ getSpeciesName(props.data.species) }}
      <ColorBlock :colors="props.data.colors" :size="16" />
    </span>
    <span class="detail-row detail-center">
      {{ getPersonalityName(props.data.personality) }}({{ props.data.subtype }})
      /
      {{ getHobbyName(props.data.hobby) }}
    </span>
    <span class="detail-row detail-center"> 🎂 {{ props.data.birthday }} </span>
    <span class="detail-row">
      <span class="detail-label">服饰风格</span>
      <span class="detail-value">{{
        joinArray(props.data.styles.map(getClothingStyleName))
      }}</span>
    </span>
    <span class="detail-row">
      <span class="detail-label">口头禅</span>
      <span class="detail-value">{{ props.data.catchphrase }}</span>
    </span>
    <span class="detail-row">
      <span class="detail-label">格言</span>
      <span class="detail-value">{{ props.data.saying }}</span>
    </span>
    <!-- 默认物品图片 -->
    <div v-if="defaultItems.length > 0" class="default-items-section">
      <div class="default-items-list">
        <ItemIcon
          v-for="item in defaultItems"
          :key="item"
          :itemId="item"
          :size="60"
        />
      </div>
    </div>

    <!-- 家具列表 -->
    <div v-if="furnitureList.length > 0" class="furniture-section">
      <span
        class="furniture-label furniture-toggle"
        @click="toggleFurnitureExpanded"
      >
        家具 ({{ furnitureList.length }})
        <span class="toggle-icon">{{ isFurnitureExpanded ? "▼" : "▶" }}</span>
      </span>
      <div v-if="isFurnitureExpanded" class="furniture-list">
        <div v-for="furniture in furnitureList" :key="furniture">
          <ItemIcon :itemId="furniture" :size="60" />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.default-items-section {
  margin-top: 8px;
  margin-bottom: 8px;
}

.default-items-list {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.furniture-section {
  background: #f0f9f0;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #c8e6c8;
  margin-top: 8px;
}

.furniture-label {
  font-weight: 600;
  color: #4a9b4f;
  font-size: 0.85em;
  display: block;
  margin-bottom: 8px;
}

.furniture-toggle {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.furniture-toggle:hover {
  background-color: #e8f5e9;
}

.toggle-icon {
  font-size: 0.7em;
  color: #666;
  transition: transform 0.2s ease;
}

.furniture-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
</style>
