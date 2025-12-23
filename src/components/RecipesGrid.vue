<script setup lang="ts">
import type { Recipe } from '../types/recipe';
import type { Item } from '../types';
import { UI_TEXT } from '../constants';
import { getChineseText, formatNumber, joinArray } from '../utils/common';
import VersionBadge from './VersionBadge.vue';
import { useRouter } from 'vue-router';

interface Props {
  recipes: Recipe[];
  allItems?: Item[];
}

const props = defineProps<Props>();
const router = useRouter();

// 获取中文名称
const getChineseName = (recipe: Recipe): string => {
  return getChineseText(recipe);
};

// 格式化价格
const formatPrice = (price: number | null | undefined): string => {
  if (price == null || price === -1) return '--';
  return formatNumber(price);
};

// 获取来源
const getSource = (recipe: Recipe): string => {
  return joinArray(recipe.source) || '--';
};

// 获取材料信息（完全参考ItemDetailPage实现）
const getMaterialInfo = (materialKey: string) => {
  // 在所有物品中查找材料名称对应的物品
  const materialItem = props.allItems?.find(item =>
    item.originalData?.name.toLowerCase() === materialKey.toLowerCase()
  );

  // 返回材料的名称、图标和ID
  return {
    name: materialItem?.name || materialKey,
    imageUrl: materialItem?.imageUrl || '',
    id: materialItem?.id
  };
};

// 跳转到材料详情页
const goToMaterial = (materialKey: string) => {
  const materialInfo = getMaterialInfo(materialKey);
  if (materialInfo.id) {
    router.push(`/item/${materialInfo.id}`);
  }
};
</script>

<template>
  <div class="recipes-grid">
    <div v-if="!recipes || recipes.length === 0" class="no-data">暂无数据</div>
    <div v-for="recipe in recipes" :key="recipe.uniqueEntryId" class="recipe-card">
      <VersionBadge :version="recipe.versionAdded" />
      <div class="recipe-image-wrapper">
        <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />
      </div>
      <div class="recipe-info">
        <h3 class="recipe-name">{{ getChineseName(recipe) }}</h3>
        <div class="recipe-details">
          <div class="detail-row">
            <span class="detail-label">分类</span>
            <span class="detail-value">{{ recipe.category }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ UI_TEXT.LABELS.PRICE }}</span>
            <span class="detail-value price">{{ formatPrice(recipe.sell) }} {{ UI_TEXT.CURRENCY }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ UI_TEXT.LABELS.SOURCE }}</span>
            <span class="detail-value">{{ getSource(recipe) }}</span>
          </div>
          <div v-if="recipe.materials && Object.keys(recipe.materials).length > 0" class="materials-section">
            <span class="materials-label">所需材料</span>
            <div class="materials-list">
              <div 
                v-for="(quantity, material) in recipe.materials" 
                :key="material" 
                class="material-item"
                :class="{ 'material-clickable': getMaterialInfo(material).id }"
                @click="goToMaterial(material)"
              >
                <div class="material-info">
                  <img 
                    v-if="getMaterialInfo(material).imageUrl"
                    :src="getMaterialInfo(material).imageUrl" 
                    :alt="getMaterialInfo(material).name"
                    class="material-icon"
                  />
                  <span class="material-name">{{ getMaterialInfo(material).name }}</span>
                </div>
                <span class="material-quantity">× {{ quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.recipe-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 152, 0, 0.2);
}

.recipe-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.recipe-info {
  width: 100%;
}

.recipe-name {
  font-size: 1.2em;
  color: #ff9800;
  margin: 0 0 12px 0;
  font-weight: 600;
  text-align: center;
}

.recipe-details {
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

.detail-row.materials {
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 600;
  color: #666;
}

.detail-value {
  color: #333;
  text-align: right;
  word-wrap: break-word;
}

.detail-value.price {
  color: #ff9800;
  font-weight: 600;
}

.materials-section {
  background: #fff9f0;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ffe0b2;
}

.materials-label {
  font-weight: 600;
  color: #e65100;
  font-size: 0.85em;
  display: block;
  margin-bottom: 8px;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffcc80;
  transition: all 0.2s;
}

.material-item.material-clickable {
  cursor: pointer;
}

.material-item.material-clickable:hover {
  border-color: #ff9800;
  transform: translateX(3px);
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.15);
}

.material-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px;
}

.material-name {
  font-size: 0.85em;
  color: #333;
  font-weight: 500;
}

.material-quantity {
  background: #ff9800;
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .recipes-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .recipe-card {
    padding: 15px;
  }

  .recipe-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .recipe-name {
    font-size: 1.1em;
  }
}
</style>
