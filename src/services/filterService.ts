import type { Item, FilterOptions } from '../types';
import { CONFIG } from '../config';

/**
 * 检查物品是否匹配搜索词
 */
function matchesSearchTerm(item: Item, searchTerm: string): boolean {
  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * 检查物品是否匹配分类筛选
 */
function matchesCategory(item: Item, category: string): boolean {
  return !category || item.category === category;
}

/**
 * 检查物品是否匹配拥有状态筛选
 */
function matchesOwnedFilter(item: Item, ownedFilter: string): boolean {
  if (ownedFilter === CONFIG.FILTER_OPTIONS.ALL) return true;
  if (ownedFilter === CONFIG.FILTER_OPTIONS.OWNED) return item.owned;
  if (ownedFilter === CONFIG.FILTER_OPTIONS.NOT_OWNED) return !item.owned;
  return true;
}

/**
 * 检查物品是否匹配版本筛选
 */
function matchesVersion(item: Item, versionFilter: string): boolean {
  return !versionFilter || item.versionAdded === versionFilter;
}

/**
 * 检查物品是否匹配来源筛选
 */
function matchesSource(item: Item, sourceFilter: string): boolean {
  return !sourceFilter || (item.source?.includes(sourceFilter) ?? false);
}

/**
 * 检查物品是否匹配尺寸筛选
 */
function matchesSize(item: Item, sizeFilter: string): boolean {
  return !sizeFilter || item.size === sizeFilter;
}

/**
 * 检查物品是否匹配标签筛选
 */
function matchesTag(item: Item, tagFilter: string): boolean {
  return !tagFilter || item.tag === tagFilter;
}

/**
 * 检查物品是否匹配系列筛选
 */
function matchesSeries(item: Item, seriesFilter: string): boolean {
  return !seriesFilter || item.series === seriesFilter;
}

/**
 * 检查物品或其变体是否匹配颜色筛选
 * @returns 是否匹配颜色
 */
function matchesColor(item: Item, colorFilter: string): boolean {
  if (!colorFilter) return true;
  
  // 检查物品本身的颜色
  if (item.colors?.includes(colorFilter)) {
    return true;
  }
  
  // 检查变体颜色
  if (item.variantGroups) {
    for (let i = 0; i < item.variantGroups.length; i++) {
      const variation = item.variantGroups[i];
      if (variation) {
        for (let j = 0; j < variation.patterns.length; j++) {
          const pattern = variation.patterns[j];
          if (pattern?.colors?.includes(colorFilter)) {
            item.vIndex = i;
            item.pIndex = j;
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

/**
 * 更新物品显示属性以匹配选定的颜色变体
 */
function updateItemForColorVariant(item: Item, colorFilter: string): void {
  if (!colorFilter || !item.hasVariations || !item.variantGroups) {
    return;
  }

  for (const variantGroup of item.variantGroups) {
    for (const pattern of variantGroup.patterns) {
      if (pattern.colors?.includes(colorFilter)) {
        item.id = pattern.id;
        item.imageUrl = pattern.imageUrl;
        return;
      }
    }
  }
}

/**
 * 筛选物品列表
 * @param allItems 所有物品
 * @param filters 筛选条件
 * @returns 筛选后的物品列表
 */
export function filterItems(allItems: Item[], filters: FilterOptions): Item[] {
  return allItems.filter(item => {
    // 检查所有筛选条件
    const matches = (
      matchesSearchTerm(item, filters.searchTerm) &&
      matchesCategory(item, filters.category) &&
      matchesOwnedFilter(item, filters.ownedFilter) &&
      matchesVersion(item, filters.versionFilter) &&
      matchesSource(item, filters.sourceFilter) &&
      matchesSize(item, filters.sizeFilter) &&
      matchesTag(item, filters.tagFilter) &&
      matchesSeries(item, filters.seriesFilter) &&
      matchesColor(item, filters.colorFilter)
    );
    
    // 如果匹配且有颜色筛选，更新物品显示属性
    if (matches) {
      updateItemForColorVariant(item, filters.colorFilter);
    }
    
    return matches;
  });
}

/**
 * 比较函数：按名称升序
 */
function compareByNameAsc(a: Item, b: Item): number {
  return a.name.localeCompare(b.name, 'zh-CN');
}

/**
 * 比较函数：按名称降序
 */
function compareByNameDesc(a: Item, b: Item): number {
  return b.name.localeCompare(a.name, 'zh-CN');
}

/**
 * 比较函数：按ID升序
 */
function compareByIdAsc(a: Item, b: Item): number {
  return (a.id || 0) - (b.id || 0);
}

/**
 * 比较函数：按ID降序
 */
function compareByIdDesc(a: Item, b: Item): number {
  return (b.id || 0) - (a.id || 0);
}

/**
 * 获取排序比较函数
 */
function getSortComparator(sortValue: string): (a: Item, b: Item) => number {
  switch (sortValue) {
    case CONFIG.SORT_OPTIONS.NAME_ASC:
      return compareByNameAsc;
    case CONFIG.SORT_OPTIONS.NAME_DESC:
      return compareByNameDesc;
    case CONFIG.SORT_OPTIONS.ID_ASC:
      return compareByIdAsc;
    case CONFIG.SORT_OPTIONS.ID_DESC:
      return compareByIdDesc;
    default:
      return () => 0;
  }
}

/**
 * 对物品列表进行排序
 * @param items 要排序的物品列表
 * @param sortValue 排序方式
 * @returns 排序后的物品列表
 */
export function sortItems(items: Item[], sortValue: string): Item[] {
  const sortedItems = [...items];
  const comparator = getSortComparator(sortValue);
  sortedItems.sort(comparator);
  return sortedItems;
}
