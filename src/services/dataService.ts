import type { RawItem, CatalogItem, Translations, Item, VariantGroup } from '../types';
import { CONFIG } from '../config';

let translationsCache: Translations | null = null;

/**
 * 加载翻译数据
 * @returns 翻译数据对象
 */
export async function loadTranslations(): Promise<Translations> {
  if (translationsCache) {
    return translationsCache;
  }
  
  try {
    const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translationsCache = await response.json();
    return translationsCache!;
  } catch (error) {
    console.error('加载翻译数据失败:', error);
    // 返回空翻译对象作为降级方案
    return { categories: {}, sources: {}, colors: {}, tags: {}, series: {} };
  }
}

/**
 * 加载物品数据
 * @returns 原始物品数据数组
 */
export async function loadItemsData(): Promise<RawItem[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.ITEMS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载物品数据失败:', error);
    throw error;
  }
}

/**
 * 加载目录数据（用户拥有的物品）
 * @returns 包含拥有物品名称和ID集合的对象
 */
export async function loadCatalogData(): Promise<{ ownedNames: Set<string>; ownedIds: Set<string> }> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    if (!response.ok) {
      console.log("无法加载 catalog_items.json，将不显示拥有状态");
      return { ownedNames: new Set(), ownedIds: new Set() };
    }
    
    const data: { items: CatalogItem[] } = await response.json();
    const ownedNames = new Set<string>();
    const ownedIds = new Set<string>();
    
    data.items.forEach(item => {
      ownedNames.add(item.label);
      ownedIds.add(item.unique_id);
    });
    
    return { ownedNames, ownedIds };
  } catch (error) {
    console.log("无法加载 catalog_items.json，将不显示拥有状态");
    return { ownedNames: new Set(), ownedIds: new Set() };
  }
}

/**
 * 处理变体数据
 * @param item 原始物品数据
 * @returns 变体组数组和是否有变体的标志
 */
function processVariations(item: RawItem): { variantGroups: VariantGroup[]; hasVariations: boolean } {
  if (!item.variations || item.variations.length === 0) {
    return { variantGroups: [], hasVariations: false };
  }

  const variantMap = new Map<string, VariantGroup>();

  item.variations.forEach((v) => {
    const variantName = v.variantTranslations?.cNzh || v.variation || "";

    if (!variantMap.has(variantName)) {
      variantMap.set(variantName, {
        variantName: variantName,
        patterns: [],
      });
    }
    
    const variant = variantMap.get(variantName)!;
    variant.patterns.push({
      patternName: v.patternTranslations?.cNzh || v.pattern || "",
      imageUrl: v.image || v.storageImage || v.closetImage || v.framedImage || item.inventoryImage || '',
      id: v.internalId || item.internalId,
      uniqueEntryId: v.uniqueEntryId,
      colors: v.colors || item.colors || [],
    });
  });

  const variantGroups = Array.from(variantMap.values());
  return { variantGroups, hasVariations: variantGroups.length > 0 };
}

/**
 * 获取物品的默认显示属性
 * @param item 原始物品数据
 * @param variantGroups 变体组数组
 * @returns 包含ID、图片URL和颜色的对象
 */
function getDefaultDisplayProperties(
  item: RawItem,
  variantGroups: VariantGroup[]
): { id: number; imageUrl: string; colors: string[] } {
  let id = item.internalId;
  let imageUrl = item.image || item.storageImage || item.closetImage || 
                 item.framedImage || item.inventoryImage || '';
  let colors = item.colors || [];

  // 如果有变体，使用第一个变体的第一个图案
  if (variantGroups.length > 0) {
    const firstVariant = variantGroups[0];
    if (firstVariant && firstVariant.patterns.length > 0) {
      const firstPattern = firstVariant.patterns[0];
      if (firstPattern) {
        id = firstPattern.id || id;
        imageUrl = firstPattern.imageUrl || imageUrl;
        colors = firstPattern.colors || colors;
      }
    }
  }

  return { id, imageUrl, colors };
}

/**
 * 检查物品是否被拥有
 * @param name 物品名称
 * @param internalId 内部ID
 * @param uniqueEntryId 唯一条目ID
 * @param ownedData 拥有数据
 * @returns 是否拥有
 */
function checkIfOwned(
  name: string,
  internalId: number,
  uniqueEntryId: string,
  ownedData: { ownedNames: Set<string>; ownedIds: Set<string> }
): boolean {
  const { ownedNames, ownedIds } = ownedData;
  return ownedNames.has(name) || 
         ownedIds.has(String(internalId)) || 
         ownedIds.has(uniqueEntryId);
}

/**
 * 处理物品数据
 * @param acnhItems 原始物品数据数组
 * @param ownedData 拥有物品数据
 * @returns 处理后的物品数组
 */
export function processItemsData(
  acnhItems: RawItem[],
  ownedData: { ownedNames: Set<string>; ownedIds: Set<string> }
): Item[] {
  return acnhItems
    .map((item) => {
      const name = item.translations?.cNzh || item.name;
      
      // 处理变体
      const { variantGroups, hasVariations } = processVariations(item);
      
      // 获取默认显示属性
      const { id, imageUrl, colors } = getDefaultDisplayProperties(item, variantGroups);
      
      // 检查是否拥有
      const owned = checkIfOwned(name, item.internalId, item.uniqueEntryId, ownedData);

      return {
        name,
        id,
        category: item.sourceSheet || "Other",
        imageUrl,
        colors,
        owned,
        variantGroups,
        hasVariations,
        vIndex: 0,
        pIndex: 0,
        versionAdded: item.versionAdded,
        source: item.source,
        size: item.size,
        tag: item.tag,
        series: item.series,
        seriesName: item.seriesTranslations?.cNzh || item.series,
        originalData: item,
      };
    })
    .sort((a, b) => a.id - b.id);
}

/**
 * 获取翻译文本的通用函数
 * @param key 翻译键
 * @param translationMap 翻译映射表
 * @returns 翻译后的文本，如果没有找到则返回原键
 */
function getTranslation(key: string, translationMap: Record<string, string> | undefined): string {
  return translationMap?.[key] || key;
}

/**
 * 获取分类名称
 * @param category 分类键
 * @returns 翻译后的分类名称
 */
export function getCategoryName(category: string): string {
  return getTranslation(category, translationsCache?.categories);
}

/**
 * 获取来源名称
 * @param source 来源键
 * @returns 翻译后的来源名称
 */
export function getSourceName(source: string): string {
  return getTranslation(source, translationsCache?.sources);
}

/**
 * 获取颜色名称
 * @param color 颜色键
 * @returns 翻译后的颜色名称
 */
export function getColorName(color: string): string {
  return getTranslation(color, translationsCache?.colors);
}

/**
 * 获取标签名称
 * @param tag 标签键
 * @returns 翻译后的标签名称
 */
export function getTagName(tag: string): string {
  return getTranslation(tag, translationsCache?.tags);
}

/**
 * 获取系列名称
 * @param series 系列键
 * @returns 翻译后的系列名称
 */
export function getSeriesName(series: string): string {
  return getTranslation(series, translationsCache?.series);
}

/**
 * 获取分类顺序列表
 * @returns 分类键数组
 */
export function getCategoryOrder(): string[] {
  return Object.keys(translationsCache?.categories || {});
}

/**
 * 获取来源顺序列表
 * @returns 来源键数组
 */
export function getSourceOrder(): string[] {
  return Object.keys(translationsCache?.sources || {});
}

/**
 * 获取颜色顺序列表
 * @returns 颜色键数组
 */
export function getColorOrder(): string[] {
  return Object.keys(translationsCache?.colors || {});
}
