import type { Item } from '../types';

/**
 * Item 相关的纯函数工具集
 * 用于筛选、判断等无状态场景
 */

/**
 * 检查物品是否匹配指定颜色
 * 检查物品本身及其所有变体的颜色
 */
export function itemMatchesColor(item: Item, color: string): boolean {
  if (!color) return true;
  
  // 检查物品本身的颜色
  if (item.colors?.includes(color)) {
    return true;
  }
  
  // 检查所有变体和图案是否包含该颜色
  if (item.variantGroups && item.variantGroups.length > 0) {
    return item.variantGroups.some(variant => 
      variant.patterns.some(pattern => 
        pattern.colors?.includes(color)
      )
    );
  }
  
  return false;
}

/**
 * 查找匹配颜色的变体和图案索引
 */
export function findColorVariantIndex(
  item: Item, 
  color: string
): { variantIndex: number; patternIndex: number } | null {
  if (!color) return null;
  
  // 遍历所有变体和图案
  const variants = item.variantGroups || [];
  if (variants.length === 0) {
    // 没有变体，检查物品本身的颜色
    return item.colors?.includes(color) ? { variantIndex: 0, patternIndex: 0 } : null;
  }

  // 有变体的情况
  for (let vIdx = 0; vIdx < variants.length; vIdx++) {
    const variant = variants[vIdx];
    if (variant) {
      for (let pIdx = 0; pIdx < variant.patterns.length; pIdx++) {
        const pattern = variant.patterns[pIdx];
        if (pattern?.colors?.includes(color)) {
          return { variantIndex: vIdx, patternIndex: pIdx };
        }
      }
    }
  }

  return null;
}

/**
 * 检查物品是否有多个变体
 */
export function hasMultipleVariants(item: Item): boolean {
  return (item.variantGroups?.length ?? 0) > 1;
}

/**
 * 检查物品是否有变体（包括单个变体多个图案的情况）
 */
export function hasVariations(item: Item): boolean {
  const groups = item.variantGroups || [];
  return groups.length > 0 && 
         (groups.length > 1 || (groups[0]?.patterns.length ?? 0) > 1);
}

/**
 * 检查物品是否有指定来源
 */
export function hasSource(item: Item, source: string): boolean {
  return item.source?.includes(source) ?? false;
}

/**
 * 检查物品是否包含指定颜色
 */
export function hasColor(item: Item, color: string): boolean {
  return item.colors?.includes(color) ?? false;
}

/**
 * 获取物品的版本信息（安全访问）
 */
export function getItemVersion(item: Item): string {
  return item.versionAdded || '未知版本';
}

/**
 * 获取物品的尺寸信息（安全访问）
 */
export function getItemSize(item: Item): string {
  return item.size || '未知尺寸';
}

/**
 * 获取物品的来源列表（安全访问）
 */
export function getItemSources(item: Item): string[] {
  return item.source || [];
}

/**
 * 检查物品是否匹配指定版本
 */
export function itemMatchesVersion(item: Item, version: string): boolean {
  return !version || (item.versionAdded === version);
}

/**
 * 检查物品是否匹配指定尺寸
 */
export function itemMatchesSize(item: Item, size: string): boolean {
  return !size || (item.size === size);
}

/**
 * 检查物品是否匹配指定标签
 */
export function itemMatchesTag(item: Item, tag: string): boolean {
  return !tag || (item.tag === tag);
}

/**
 * 检查物品是否匹配指定系列
 */
export function itemMatchesSeries(item: Item, series: string): boolean {
  return !series || (item.series === series);
}

/**
 * 检查物品是否匹配指定来源
 */
export function itemMatchesSource(item: Item, source: string): boolean {
  return !source || (item.source?.includes(source) ?? false);
}
