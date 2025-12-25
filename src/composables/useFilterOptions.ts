import { ref, type Ref } from "vue";
import { ItemModel } from "../models/ItemModel";
import { Color, ItemCategory, ItemSize, Version } from "../types/item";
import {
  getCategoryName,
  getColorName,
  getSeriesName,
  getSizeName,
  getSourceName,
  getTagName,
  getVersionName,
} from "../services/dataService";

export interface FilterOption<T = string> {
  value?: T;
  name: string;
}

export interface FilterOptionsData {
  categories: Ref<FilterOption<ItemCategory>[]>;
  versions: Ref<FilterOption<Version>[]>;
  sources: Ref<FilterOption[]>;
  sizes: Ref<FilterOption<ItemSize>[]>;
  tags: Ref<FilterOption[]>;
  colors: Ref<FilterOption<Color>[]>;
  series: Ref<FilterOption[]>;
  populateFilters: (items: ItemModel[]) => void;
}

/**
 * 组合函数：管理筛选器选项
 * 从物品列表中提取并维护各种筛选器选项
 */
export function useFilterOptions(): FilterOptionsData {
  const categories = ref<FilterOption<ItemCategory>[]>([]);
  const versions = ref<FilterOption<Version>[]>([]);
  const sources = ref<FilterOption[]>([]);
  const sizes = ref<FilterOption<ItemSize>[]>([]);
  const tags = ref<FilterOption[]>([]);
  const colors = ref<FilterOption<Color>[]>([]);
  const series = ref<FilterOption[]>([]);

  categories.value = Object.values(ItemCategory).map((category) => ({
    value: category,
    name: getCategoryName(category),
  }));

  versions.value = Object.values(Version).map((version) => ({
    value: version,
    name: getVersionName(version),
  }));

  sizes.value = Object.values(ItemSize).map((size) => ({
    value: size,
    name: getSizeName(size),
  }));

  colors.value = Object.values(Color).map((color) => ({
    value: color,
    name: getColorName(color),
  }));

  const populateSources = (items: ItemModel[]): void => {
    const itemSources = new Set<string>();

    items.forEach((item) => {
      item.getSources().forEach((s) => itemSources.add(s));
    });

    sources.value = [...itemSources].sort().map((source) => ({
      value: source,
      name: getSourceName(source),
    }));
  };

  const populateTags = (items: ItemModel[]): void => {
    const tagsSet = new Set(
      items.map((item) => item.getTag()).filter((t): t is string => !!t)
    );

    tags.value = [...tagsSet]
      .sort()
      .map((tag) => ({
        value: tag,
        name: getTagName(tag),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  };

  const populateSeries = (items: ItemModel[]): void => {
    const seriesSet = new Set(
      items.map((item) => item.getSeries()).filter((s): s is string => !!s)
    );
    series.value = [...seriesSet].sort().map((ser) => ({
      value: ser,
      name: getSeriesName(ser),
    }));
  };

  const populateFilters = (items: ItemModel[]): void => {
    populateSources(items);
    populateTags(items);
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
    populateFilters,
  };
}
