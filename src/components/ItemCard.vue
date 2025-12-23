<script setup lang="ts">
import { computed, reactive, onMounted, watch } from 'vue';
import type { Item } from '../types';
import { getSourceName, getTagName } from '../services/dataService';
import { ItemModel } from '../models';
import { useColorDisplay } from '../composables/useColorDisplay';

const props = defineProps<{
  item: Item;
  colorFilter?: string;
}>();

// 直接创建 ItemModel 实例，不使用 ref 包裹
const itemModel = new ItemModel(props.item);

// 应用颜色筛选的辅助函数
const applyColorFilter = () => {
  if (props.colorFilter && props.item.variantGroups && props.item.variantGroups.length > 0) {
    const match = itemModel.findVariantByColor(props.colorFilter);
    if (match) {
      itemModel.setVariantIndex(match.variantIndex);
      itemModel.setPatternIndex(match.patternIndex);
      forceUpdate();
    }
  }
};

// 如果有颜色筛选，初始化时切换到匹配的变体
onMounted(() => {
  applyColorFilter();
});

// 监听颜色筛选器变化
watch(() => props.colorFilter, () => {
  // 重置为默认变体
  itemModel.setVariantIndex(0);
  itemModel.setPatternIndex(0);
  // 应用新的颜色筛选
  applyColorFilter();
});

// 创建一个响应式状态来触发更新
const updateKey = reactive({ value: 0 });

// 强制更新的辅助函数
const forceUpdate = () => {
  updateKey.value++;
};

// 计算属性 - 依赖 updateKey 来确保响应式
const currentVariant = computed(() => {
  updateKey.value; // 触发依赖
  return itemModel.getCurrentVariant();
});

const displayImage = computed(() => {
  updateKey.value;
  return itemModel.getDisplayImage();
});

const displayId = computed(() => {
  updateKey.value;
  return itemModel.getDisplayId();
});

const displayColors = computed(() => {
  updateKey.value;
  return itemModel.getDisplayColors();
});

const displayName = computed(() => {
  updateKey.value;
  return itemModel.getDisplayName();
});

const hasMultipleVariants = computed(() => itemModel.hasMultipleVariants());
const hasPatterns = computed(() => {
  updateKey.value;
  return itemModel.hasPatterns();
});

// 响应式索引
const vIndex = computed(() => {
  updateKey.value;
  return itemModel.getVariantIndex();
});

const pIndex = computed(() => {
  updateKey.value;
  return itemModel.getPatternIndex();
});

// 使用颜色显示组合函数
const { conicGradientStyle: colorBlockStyle } = useColorDisplay(displayColors);

// 便捷方法
const version = computed(() => itemModel.getVersion());
const size = computed(() => itemModel.getSize());
const sources = computed(() => itemModel.getSources());
const seriesName = computed(() => itemModel.getSeriesName());
const tag = computed(() => itemModel.getTag());

// 方法
const selectVariant = (index: number): void => {
  itemModel.setVariantIndex(index);
  forceUpdate();
};

const selectPattern = (index: number): void => {
  itemModel.setPatternIndex(index);
  forceUpdate();
};

// 图片加载错误处理
const imageError = reactive({ value: false });
const handleImageError = (): void => {
  imageError.value = true;
};
</script>

<template>
  <div class="item-card" :class="{ 'item-owned': item.owned }">
    <div v-if="version !== '未知版本'" class="version-badge">
      {{ version }}
    </div>
    
    <div class="image-container">
      <img 
        v-if="!imageError.value"
        :src="displayImage" 
        :alt="item.name" 
        class="item-image" 
        loading="lazy"
        @error="handleImageError"
      >
      <div v-else class="image-placeholder">
        <span>📦</span>
        <span class="placeholder-text">图片加载失败</span>
      </div>
    </div>
    
    <div class="item-name">{{ displayName }}</div>
    <div class="item-id">ID: {{ displayId || 'N/A' }}</div>
    
    <div v-if="sources.length > 0" class="source-info">
      📍 {{ sources.map(s => getSourceName(s)).join(', ') }}
    </div>
    
    <div v-if="size !== '未知尺寸' || displayColors.length > 0" class="size-tag-info">
      <span v-if="size !== '未知尺寸'">📏 {{ size }}</span>
      <span v-if="displayColors.length > 0" class="color-block" :style="{ background: colorBlockStyle }"></span>
    </div>
    
    <div v-if="tag || seriesName !== '无系列'" class="tag-series-info">
      <span v-if="tag">🏷️ {{ getTagName(tag) }}</span>
      <span v-if="tag && seriesName !== '无系列'"> · </span>
      <span v-if="seriesName !== '无系列'">📦 {{ seriesName }}</span>
    </div>
    
    <div v-if="hasMultipleVariants" class="variation-row variant-row">
      <span class="variation-label">款式:</span>
      <div class="variation-dots">
        <span
          v-for="(vg, vIdx) in item.variantGroups"
          :key="vIdx"
          class="variation-dot variant-dot"
          :class="{ active: vIdx === vIndex }"
          :title="vg.variantName || `款式 ${vIdx + 1}`"
          @click="selectVariant(vIdx)"
        >
          {{ vIdx + 1 }}
        </span>
      </div>
    </div>
    
    <div v-if="hasPatterns" class="variation-row pattern-row">
      <span class="variation-label">图案:</span>
      <div class="variation-dots">
        <span
          v-for="(p, pIdx) in currentVariant!.patterns"
          :key="pIdx"
          class="variation-dot pattern-dot"
          :class="{ active: pIdx === pIndex }"
          :title="p.patternName || `图案 ${pIdx + 1}`"
          @click="selectPattern(pIdx)"
        >
          {{ pIdx + 1 }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-owned {
  background: #e8f5e9;
  border: 2px solid #4caf50;
}

.version-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff9800;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.image-container {
  width: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
  padding: 20px;
}

.image-placeholder span:first-child {
  font-size: 48px;
}

.placeholder-text {
  font-size: 12px;
}

.item-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-id {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.source-info {
  font-size: 11px;
  color: #495057;
  margin-top: 5px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size-tag-info {
  font-size: 11px;
  color: #495057;
  padding: 4px 8px;
  background: #e9ecef;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tag-series-info {
  font-size: 11px;
  color: #495057;
  padding: 4px 8px;
  background: #fff3cd;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.color-block {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.variation-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.variation-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.variation-dots {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.variation-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.variation-dot:hover {
  background: #c8c8c8;
  transform: scale(1.1);
}

.variation-dot.active {
  background: #4a9b4f;
  color: white;
}
</style>
