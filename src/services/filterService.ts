import type { FilterOptions } from "../types";
import { ItemModel } from "../models/ItemModel";
import { CONFIG } from "../config";

function matchesSearchTerm(item: ItemModel, searchTerm: string): boolean {
  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
}

function matchesOwnedFilter(item: ItemModel, ownedFilter?: boolean): boolean {
  if (ownedFilter === undefined) return true;
  return item.owned === ownedFilter;
}

export function filterItems(
  allItems: ItemModel[],
  filters: FilterOptions
): ItemModel[] {
  return allItems.filter((item) => {
    return (
      matchesSearchTerm(item, filters.searchTerm) &&
      matchesOwnedFilter(item, filters.ownedFilter) &&
      item.matchesCategory(filters.category) &&
      item.matchesVersion(filters.versionFilter) &&
      item.matchesSource(filters.sourceFilter) &&
      item.matchesSize(filters.sizeFilter) &&
      item.matchesTag(filters.tagFilter) &&
      item.matchesSeries(filters.seriesFilter) &&
      item.matchesColor(filters.colorFilter) &&
      item.matchesTheme(filters.themeFilter) &&
      item.matchesStyle(filters.styleFilter)
    );
  });
}

/**
 * 比较函数：按名称升序
 */
function compareByNameAsc(a: ItemModel, b: ItemModel): number {
  return a.name.localeCompare(b.name, "zh-CN");
}

/**
 * 比较函数：按名称降序
 */
function compareByNameDesc(a: ItemModel, b: ItemModel): number {
  return b.name.localeCompare(a.name, "zh-CN");
}

/**
 * 比较函数：按ID升序
 */
function compareByIdAsc(a: ItemModel, b: ItemModel): number {
  return (a.id || 0) - (b.id || 0);
}

/**
 * 比较函数：按ID降序
 */
function compareByIdDesc(a: ItemModel, b: ItemModel): number {
  return (b.id || 0) - (a.id || 0);
}

/**
 * 获取排序比较函数
 */
function getSortComparator(
  sortValue: string
): (a: ItemModel, b: ItemModel) => number {
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
export function sortItems(items: ItemModel[], sortValue: string): ItemModel[] {
  const sortedItems = [...items];
  const comparator = getSortComparator(sortValue);
  sortedItems.sort(comparator);
  return sortedItems;
}
