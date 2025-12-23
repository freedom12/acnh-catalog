<script setup lang="ts">
import type { Construction } from '../types/construction';
import { getChineseText, formatNumber, joinArray } from '../utils/common';
import VersionBadge from './VersionBadge.vue';

interface Props {
  construction: Construction[];
}

defineProps<Props>();

// 获取中文名称
const getChineseName = (item: Construction): string => {
  return getChineseText(item);
};

// 格式化价格
const formatPrice = (price: number | null | undefined): string => {
  if (price == null || price === -1) return '--';
  return formatNumber(price);
};

// 获取来源
const getSource = (item: Construction): string => {
  return joinArray(item.source) || '--';
};
</script>

<template>
  <div class="construction-grid">
    <div v-if="!construction || construction.length === 0" class="no-data">暂无数据</div>
    <div v-for="item in construction" :key="item.uniqueEntryId" class="construction-card">
      <VersionBadge :version="item.versionAdded" />
      <div class="construction-image-wrapper">
        <img :src="item.image" :alt="item.name" class="construction-image" />
      </div>
      <div class="construction-info">
        <h3 class="construction-name">{{ getChineseName(item) }}</h3>
        <div class="construction-details">
          <div class="detail-row">
            <span class="detail-label">分类</span>
            <span class="detail-value">{{ item.category }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">💰 价格</span>
            <span class="detail-value price">{{ formatPrice(item.buy) }} 铃钱</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">来源</span>
            <span class="detail-value">{{ getSource(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.construction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.construction-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.construction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(121, 85, 72, 0.2);
}

.construction-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.construction-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.construction-info {
  width: 100%;
}

.construction-name {
  font-size: 1.2em;
  color: #795548;
  margin: 0 0 12px 0;
  font-weight: 600;
  text-align: center;
}

.construction-details {
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

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
  text-align: right;
  word-wrap: break-word;
  max-width: 65%;
}

.detail-value.price {
  color: #795548;
  font-weight: 600;
}

@media (max-width: 768px) {
  .construction-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .construction-card {
    padding: 15px;
  }

  .construction-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .construction-name {
    font-size: 1.1em;
  }
}
</style>
