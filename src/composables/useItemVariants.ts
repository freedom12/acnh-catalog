import { ref, computed } from 'vue';
import type { Item, VariantGroup, Pattern } from '../types';

/**
 * 组合函数：管理物品变体和图案
 */
export function useItemVariants(item: Item) {
  const vIndex = ref(item.vIndex || 0);
  const pIndex = ref(item.pIndex || 0);

  /**
   * 当前选中的变体组
   */
  const currentVariant = computed<VariantGroup | null>(() => {
    if (!item.hasVariations || !item.variantGroups?.length) {
      return null;
    }
    return item.variantGroups[vIndex.value] || item.variantGroups[0] || null;
  });

  /**
   * 当前选中的图案
   */
  const currentPattern = computed<Pattern | null>(() => {
    if (!currentVariant.value?.patterns?.length) {
      return null;
    }
    return currentVariant.value.patterns[pIndex.value] || currentVariant.value.patterns[0] || null;
  });

  /**
   * 显示的图片URL
   */
  const displayImage = computed(() => {
    return currentPattern.value?.imageUrl || item.imageUrl;
  });

  /**
   * 显示的物品ID
   */
  const displayId = computed(() => {
    return currentPattern.value?.id || item.id;
  });

  /**
   * 显示的颜色列表
   */
  const displayColors = computed(() => {
    return currentPattern.value?.colors || item.colors || [];
  });

  /**
   * 显示的完整名称（包含变体和图案）
   */
  const displayName = computed(() => {
    const parts = [item.name];
    
    if (currentVariant.value?.variantName) {
      parts.push(currentVariant.value.variantName);
    }
    
    if (currentPattern.value?.patternName) {
      parts.push(currentPattern.value.patternName);
    }
    
    return parts.join(' - ');
  });

  /**
   * 是否有多个变体
   */
  const hasMultipleVariants = computed(() => {
    return item.hasVariations && (item.variantGroups?.length || 0) > 1;
  });

  /**
   * 当前变体是否有多个图案
   */
  const hasPatterns = computed(() => {
    return (currentVariant.value?.patterns?.length || 0) > 1;
  });

  /**
   * 选择变体
   */
  const selectVariant = (index: number): void => {
    vIndex.value = index;
    pIndex.value = 0; // 切换变体时重置图案索引
  };

  /**
   * 选择图案
   */
  const selectPattern = (index: number): void => {
    pIndex.value = index;
  };

  return {
    vIndex,
    pIndex,
    currentVariant,
    currentPattern,
    displayImage,
    displayId,
    displayColors,
    displayName,
    hasMultipleVariants,
    hasPatterns,
    selectVariant,
    selectPattern
  };
}
