<script setup lang="ts">
import type { Reaction } from '../types/reaction';

interface Props {
  reactions: Reaction[];
}

defineProps<Props>();

// 获取中文名称
const getChineseName = (reaction: Reaction): string => {
  return reaction.translations?.cNzh || reaction.name;
};

// 获取来源文本
const getSourceText = (sources: string[]): string => {
  if (!sources || sources.length === 0) return '未知';
  return sources.join(', ');
};
</script>

<template>
  <div class="reactions-grid">
    <div v-for="reaction in reactions" :key="reaction.uniqueEntryId" class="reaction-card">
      <div class="reaction-image-wrapper">
        <img :src="reaction.image" :alt="reaction.name" class="reaction-image" />
      </div>
      <div class="reaction-info">
        <h3 class="reaction-name">{{ getChineseName(reaction) }}</h3>
        <div class="reaction-details">
          <div class="detail-item source">
            <span class="label">来源:</span>
            <span class="value">{{ getSourceText(reaction.source) }}</span>
          </div>
          <div class="detail-item version" v-if="reaction.versionAdded">
            <span class="label">版本:</span>
            <span class="value">{{ reaction.versionAdded }}</span>
          </div>
          <div class="detail-item event" v-if="reaction.seasonEvent">
            <span class="label">活动:</span>
            <span class="value">{{ reaction.seasonEvent }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reactions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.reaction-card {
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
}

.reaction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(156, 39, 176, 0.2);
}

.reaction-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.reaction-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.reaction-info {
  width: 100%;
}

.reaction-name {
  font-size: 1.2em;
  color: #9c27b0;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.reaction-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.detail-item {
  padding: 6px 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 0.85em;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.source {
  background-color: #f3e5f5;
}

.detail-item.version {
  background-color: #fff9c4;
}

.detail-item.event {
  background-color: #ffe0b2;
}

.detail-item .label {
  font-weight: 600;
  color: #666;
  font-size: 0.9em;
}

.detail-item .value {
  color: #333;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .reactions-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
  }

  .reaction-card {
    padding: 15px;
  }

  .reaction-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .reaction-name {
    font-size: 1.1em;
  }
}
</style>
