<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Villager } from "../types/villager";
import { ENTITY_ICONS, PERSONALITY_MAP } from "../constants";
import { getChineseText, lightenColor } from "../utils/common";
import { useItemsData } from "../composables/useItemsData";
import BaseCard from "./BaseCard.vue";
import ItemIcon from "./ItemIcon.vue";

interface Props {
  data: Villager;
}

const props = defineProps<Props>();
const { loadData } = useItemsData();

// 组件挂载时确保物品数据已加载
onMounted(() => {
  loadData();
});

// 当前图片索引
const currentImageIndex = ref(0);

// 家具列表是否展开
const isFurnitureExpanded = ref(false);

// 当前形状
const currentShape = computed(() =>
  currentImageIndex.value === 0 ? "circle" : "rounded"
);

// 获取性别emoji
const getGenderIcon = (gender: string): string => {
  return gender === "Male" ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
};

// 获取性格中文
const getPersonalityChinese = (personality: string): string => {
  return PERSONALITY_MAP[personality] || personality;
};

// 获取家具列表
const furnitureList = computed(() => {
  return [
    ...(props.data.furnitureNameList || []),
    props.data.wallpaper,
    props.data.flooring,
  ];
});

// 获取默认物品列表（服装、雨伞、歌曲）
const defaultItems = computed(() => {
  return [
    props.data.defaultClothing,
    props.data.defaultUmbrella,
    props.data.favoriteSong,
  ];
});

const handleClick = () => {
  window.open(`https://nookipedia.com/wiki/${props.data.name}`, "_blank");
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
    :version="props.data.versionAdded"
    :images="[props.data.iconImage, props.data.photoImage, props.data.houseImage].filter((img): img is string => Boolean(img))"
    :displayName="getChineseText(props.data)"
    :shape="currentShape"
    :style="{
      background: props.data.bubbleColor || '#4a9b4f',
      border:
        '3px solid ' + lightenColor(props.data.bubbleColor || '#4a9b4f', -0.5),
    }"
    @click="handleClick"
    @image-index-changed="handleImageIndexChanged"
  >
    <template #name>
      <h3
        class="card-name"
        :style="{ color: props.data.nameColor || '#4a9b4f' }"
      >
        {{ getChineseText(props.data) }}
      </h3>
    </template>
    <span class="detail-row detail-center">
      {{ getGenderIcon(props.data.gender) }} {{ props.data.species }}
    </span>
    <span class="detail-row detail-center">
      {{ getPersonalityChinese(props.data.personality) }} -
      {{ props.data.subtype }} /
      {{ props.data.hobby }}
    </span>
    <span class="detail-row detail-center"> 🎂 {{ props.data.birthday }} </span>

    <!-- 默认物品图片 -->
    <div v-if="defaultItems.length > 0" class="default-items-section">
      <div class="default-items-list">
        <ItemIcon
          v-for="item in defaultItems"
          :key="item"
          :itemName="item"
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
          <ItemIcon :itemName="furniture" :size="60" />
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
