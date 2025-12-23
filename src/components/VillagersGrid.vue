<script setup lang="ts">
import type { Villager } from '../types/villager';
import { ENTITY_ICONS, PERSONALITY_MAP, UI_TEXT } from '../constants';
import { getChineseText } from '../utils/common';
import VersionBadge from './VersionBadge.vue';

interface Props {
  villagers: Villager[];
}

defineProps<Props>();

// 获取性别emoji
const getGenderIcon = (gender: string): string => {
  return gender === 'Male' ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
};

// 获取性格中文
const getPersonalityChinese = (personality: string): string => {
  return PERSONALITY_MAP[personality] || personality;
};
</script>

<template>
  <div class="villagers-grid">
    <div v-for="villager in villagers" :key="villager.name" class="villager-card">
      <VersionBadge :version="villager.versionAdded" />
      <div class="villager-image-wrapper">
        <img :src="villager.iconImage" :alt="villager.name" class="villager-image" />
      </div>
      <div class="villager-info">
        <h3 class="villager-name">{{ getChineseText(villager) }}</h3>
        <div class="villager-details">
          <span class="detail-item">
            {{ getGenderIcon(villager.gender) }} {{ villager.species }}
          </span>
          <span class="detail-item personality">
            {{ getPersonalityChinese(villager.personality) }}
          </span>
          <span class="detail-item">
            🎂 {{ villager.birthday }}
          </span>
        </div>
        <div class="villager-hobby">
          {{ UI_TEXT.LABELS.HOBBY }} {{ villager.hobby }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.villagers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.villager-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.villager-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(74, 155, 79, 0.2);
}

.villager-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #f0f8f0 0%, #e8f5e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.villager-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.villager-info {
  width: 100%;
}

.villager-name {
  font-size: 1.3em;
  color: #4a9b4f;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.villager-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.detail-item {
  padding: 4px 10px;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-size: 0.9em;
  color: #666;
}

.detail-item.personality {
  background-color: #e8f5e8;
  color: #4a9b4f;
  font-weight: 600;
}

.villager-hobby {
  font-size: 0.85em;
  color: #999;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .villagers-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  .villager-card {
    padding: 15px;
  }

  .villager-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .villager-name {
    font-size: 1.1em;
  }
}
</style>
