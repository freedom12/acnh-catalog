<script setup lang="ts">
import type { NPC } from '../types/npc';
import { ENTITY_ICONS, UI_TEXT } from '../constants';
import { getChineseText } from '../utils/common';
import VersionBadge from './VersionBadge.vue';

interface Props {
  npcs: NPC[];
}

defineProps<Props>();

// 获取性别emoji
const getGenderIcon = (gender: string): string => {
  return gender === 'Male' ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
};
</script>

<template>
  <div class="npcs-grid">
    <div v-for="npc in npcs" :key="npc.uniqueEntryId" class="npc-card">
      <VersionBadge :version="npc.versionAdded" />
      <div class="npc-image-wrapper">
        <img :src="npc.iconImage" :alt="npc.name" class="npc-image" />
      </div>
      <div class="npc-info">
        <h3 class="npc-name">{{ getChineseText(npc) }}</h3>
        <div class="npc-details">
          <span class="detail-item">
            {{ getGenderIcon(npc.gender) }}
          </span>
          <span class="detail-item">
            🎂 {{ npc.birthday }}
          </span>
        </div>
        <div class="npc-id">{{ UI_TEXT.LABELS.ID }} {{ npc.npcId }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.npcs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.npc-card {
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

.npc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 200, 100, 0.3);
}

.npc-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.npc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.npc-info {
  width: 100%;
}

.npc-name {
  font-size: 1.3em;
  color: #e67e22;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.npc-details {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
}

.detail-item {
  padding: 4px 12px;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-size: 0.9em;
  color: #666;
}

.npc-id {
  font-size: 0.85em;
  color: #999;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .npcs-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }

  .npc-card {
    padding: 15px;
  }

  .npc-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .npc-name {
    font-size: 1.1em;
  }
}
</style>
