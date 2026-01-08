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
  getSpeciesIcon,
  getConstellation,
  getConstellationIcon,
  getConstellationName,
} from "../services/dataService";
import { joinArray } from "../utils/common";
import ColorBlock from "./ColorBlock.vue";
import { processImageUrl } from "../utils/imageUtils";

const props = defineProps<{
  data: Villager;
}>();
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
  return [...props.data.furnitures, props.data.wallpaper, props.data.flooring];
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
    :colorTheme="props.data.bubbleColor"
    :version="props.data.ver"
    :images="props.data.images"
    :displayName="props.data.name"
    :shape="currentShape"
    variant="dark"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3 class="card-name" :style="{ color: props.data.nameColor }">
        {{ props.data.name }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      <span class="detail-label">
        <img :src="getGenderIcon(props.data.gender)" class="inline-icon" />
        {{ getSpeciesName(props.data.species) }}
        <img
          :src="getSpeciesIcon(props.data.species)"
          :alt="getSpeciesName(props.data.species)"
          :title="getSpeciesName(props.data.species)"
          class="inline-icon gray"
        />
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
    <span class="detail-row">
      <span class="detail-label">性格/爱好</span>
      <span class="detail-value">
        {{ getPersonalityName(props.data.personality) }}({{
          props.data.subtype
        }}) /
        {{ getHobbyName(props.data.hobby) }}
      </span>
    </span>
    <span class="detail-row">
      <span class="detail-label">喜爱颜色</span>
        <ColorBlock :colors="props.data.colors" :size="16" />
    </span>
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
    <span class="detail-row full">
      <span class="detail-label">个性签名</span>
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
      <span class="furniture-label" @click="toggleFurnitureExpanded">
        家具 ({{ furnitureList.length }})
        <span class="toggle-icon">{{ isFurnitureExpanded ? "▼" : "▶" }}</span>
      </span>
      <div v-if="isFurnitureExpanded" class="furniture-list">
        <div v-for="furniture in furnitureList" :key="furniture">
          <ItemIcon :itemId="furniture" :size="60" />
        </div>
        <ItemIcon
          :itemId="props.data.diyWorkbench[0]"
          :vIndex="props.data.diyWorkbench[1]"
          :pIndex="props.data.diyWorkbench[2]"
          :size="60"
        />
        <ItemIcon
          :itemId="props.data.kitchenware[0]"
          :vIndex="props.data.kitchenware[1]"
          :pIndex="props.data.kitchenware[2]"
          :size="60"
        />
        <img
          v-if="props.data.houseImage"
          :src="processImageUrl(props.data.houseImage)"
          :alt="'House Image'"
          :style="{ width: '60px', height: '60px', borderRadius: '4px' }"
          :key="'houseImage'"
        />
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
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
  border-radius: var(--border-radius-xl);
  padding: 8px;
  border: 2px solid #c8e6c8;
}

.furniture-label {
  font-weight: 600;
  color: #4a9b4f;
  font-size: 0.85em;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: var(--border-radius-xl);
  transition: background-color 0.2s ease;
}

.furniture-label:hover {
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
  margin-top: 8px;
}
</style>
