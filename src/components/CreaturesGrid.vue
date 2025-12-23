<script setup lang="ts">
import type { Creature } from '../types/creature';
import { ENTITY_ICONS, UI_TEXT } from '../constants';
import { getChineseText, formatNumber } from '../utils/common';
import VersionBadge from './VersionBadge.vue';

interface Props {
  creatures: Creature[];
}

defineProps<Props>();

// 获取中文名称
const getChineseName = (creature: Creature): string => {
  return getChineseText(creature);
};

// 获取类型emoji
const getTypeIcon = (sourceSheet: string): string => {
  const map: Record<string, string> = {
    'Insects': ENTITY_ICONS.INSECTS,
    'Fish': ENTITY_ICONS.FISH,
    'Sea Creatures': ENTITY_ICONS.SEA_CREATURES
  };
  return map[sourceSheet] || ENTITY_ICONS.CREATURES;
};

// 格式化价格
const formatPrice = (price: number): string => {
  return formatNumber(price);
};
</script>

<template>
  <div class="creatures-grid">
    <div v-for="creature in creatures" :key="creature.uniqueEntryId" class="creature-card">
      <VersionBadge :version="creature.versionAdded" />
      <div class="creature-image-wrapper">
        <img :src="creature.iconImage" :alt="creature.name" class="creature-image" />
      </div>
      <div class="creature-info">
        <div class="creature-header">
          <span class="type-icon">{{ getTypeIcon(creature.sourceSheet) }}</span>
          <h3 class="creature-name">{{ getChineseName(creature) }}</h3>
        </div>
        <div class="creature-details">
          <div class="detail-row">
            <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
            <span class="detail-value price">{{ formatPrice(creature.sell) }} {{ UI_TEXT.CURRENCY }}</span>
          </div>
          <div class="detail-row location">
            <span class="detail-label">{{ UI_TEXT.LABELS.LOCATION }}</span>
            <span class="detail-value">{{ creature.whereHow }}</span>
          </div>
          <div class="detail-row" v-if="creature.size">
            <span class="detail-label">{{ UI_TEXT.LABELS.SIZE }}</span>
            <span class="detail-value">{{ creature.size }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.creatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.creature-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.creature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2);
}

.creature-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.creature-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.creature-info {
  width: 100%;
}

.creature-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
}

.type-icon {
  font-size: 1.5em;
}

.creature-name {
  font-size: 1.2em;
  color: #4caf50;
  margin: 0;
  font-weight: 600;
  text-align: center;
}

.creature-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 0.9em;
}

.detail-row.location {
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
}

.detail-value.price {
  color: #4caf50;
  font-weight: 600;
}

@media (max-width: 768px) {
  .creatures-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .creature-card {
    padding: 15px;
  }

  .creature-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .creature-name {
    font-size: 1.1em;
  }
}
</style>
