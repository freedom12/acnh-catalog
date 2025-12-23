import { ref, type Ref } from 'vue';
import type { Item } from '../types';
import {
  getTagName,
  getCategoryOrder,
  getSourceOrder,
  getColorOrder
} from '../services/dataService';

export interface FilterOption {
  value: string;
  name: string;
}

export interface FilterOptionsData {
  categories: Ref<string[]>;
  versions: Ref<string[]>;
  sources: Ref<string[]>;
  sizes: Ref<string[]>;
  tags: Ref<string[]>;
  colors: Ref<string[]>;
  series: Ref<FilterOption[]>;
  populateFilters: (items: Item[]) => void;
}

/**
 * 组合函数：管理筛选器选项
 * 从物品列表中提取并维护各种筛选器选项
 */
export function useFilterOptions(): FilterOptionsData {
  const categories = ref<string[]>([]);
  const versions = ref<string[]>([]);
  const sources = ref<string[]>([]);
  const sizes = ref<string[]>([]);
  const tags = ref<string[]>([]);
  const colors = ref<string[]>([]);
  const series = ref<FilterOption[]>([]);

  /**
   * 从物品列表中填充分类选项
   */
  const populateCategories = (items: Item[]): void => {
    const categoryOrder = getCategoryOrder();
    const itemCategories = new Set(items.map(item => item.category));
    
    categories.value = [
      ...categoryOrder.filter(cat => itemCategories.has(cat)),
      ...[...itemCategories].filter(cat => !categoryOrder.includes(cat))
    ];
  };

  /**
   * 从物品列表中填充版本选项
   */
  const populateVersions = (items: Item[]): void => {
    versions.value = [...new Set(
      items
        .map(item => item.versionAdded)
        .filter((v): v is string => !!v)
    )].sort();
  };

  /**
   * 从物品列表中填充来源选项
   */
  const populateSources = (items: Item[]): void => {
    const sourceOrder = getSourceOrder();
    const itemSources = new Set<string>();
    
    items.forEach(item => {
      item.source?.forEach(s => itemSources.add(s));
    });
    
    sources.value = [
      ...sourceOrder.filter(src => itemSources.has(src)),
      ...[...itemSources].filter(src => !sourceOrder.includes(src))
    ];
  };

  /**
   * 从物品列表中填充尺寸选项
   */
  const populateSizes = (items: Item[]): void => {
    sizes.value = [...new Set(
      items
        .map(item => item.size)
        .filter((s): s is string => !!s)
    )].sort((a, b) => {
      const [aWidth, aHeight] = a.split('x').map(Number);
      const [bWidth, bHeight] = b.split('x').map(Number);
      
      if (aWidth !== undefined && bWidth !== undefined && aWidth !== bWidth) {
        return aWidth - bWidth;
      }
      return (aHeight || 0) - (bHeight || 0);
    });
  };

  /**
   * 从物品列表中填充标签选项
   */
  const populateTags = (items: Item[]): void => {
    const tagsSet = new Set(
      items
        .map(item => item.tag)
        .filter((t): t is string => !!t)
    );
    
    tags.value = [...tagsSet].sort((a, b) => 
      getTagName(a).localeCompare(getTagName(b), 'zh-CN')
    );
  };

  /**
   * 从物品列表中填充颜色选项
   */
  const populateColors = (items: Item[]): void => {
    const colorOrder = getColorOrder();
    const itemColors = new Set<string>();
    
    items.forEach(item => {
      item.colors?.forEach(c => itemColors.add(c));
    });
    
    colors.value = [
      ...colorOrder.filter(color => itemColors.has(color)),
      ...[...itemColors].filter(color => !colorOrder.includes(color))
    ];
  };

  /**
   * 从物品列表中填充系列选项
   */
  const populateSeries = (items: Item[]): void => {
    const seriesMap = new Map<string, string>();
    
    items.forEach(item => {
      if (item.series && !seriesMap.has(item.series)) {
        seriesMap.set(item.series, item.seriesName || item.series);
      }
    });
    
    series.value = [...seriesMap.entries()]
      .map(([value, name]) => ({ value, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  };

  /**
   * 填充所有筛选器选项
   */
  const populateFilters = (items: Item[]): void => {
    populateCategories(items);
    populateVersions(items);
    populateSources(items);
    populateSizes(items);
    populateTags(items);
    populateColors(items);
    populateSeries(items);
  };

  return {
    categories,
    versions,
    sources,
    sizes,
    tags,
    colors,
    series,
    populateFilters
  };
}
