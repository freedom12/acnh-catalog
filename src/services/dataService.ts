import type { RawItem, CatalogItem, Translations, Item, Villager, NPC, Creature, Reaction } from '../types';
import { CONFIG } from '../config';
import * as itemHelpers from '../utils/itemHelpers';

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
 * 处理物品数据
 * 使用 itemHelpers.createItem() 创建 Item 数据对象
 * @param acnhItems 原始物品数据数组
 * @param ownedData 拥有物品数据
 * @returns 处理后的物品数组
 */
export function processItemsData(
  acnhItems: RawItem[],
  ownedData: { ownedNames: Set<string>; ownedIds: Set<string> }
): Item[] {
  return acnhItems
    .map((rawItem) => itemHelpers.createItem(rawItem, ownedData))
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

/**
 * 加载村民数据
 * @returns 村民数据数组
 */
export async function loadVillagersData(): Promise<Villager[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.VILLAGERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载村民数据失败:', error);
    throw error;
  }
}

/**
 * 加载NPC数据
 * @returns NPC数据数组
 */
export async function loadNPCsData(): Promise<NPC[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.NPCS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载NPC数据失败:', error);
    throw error;
  }
}

/**
 * 加载生物数据（昆虫、鱼类等）
 * @returns 生物数据数组
 */
export async function loadCreaturesData(): Promise<Creature[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CREATURES);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载生物数据失败:', error);
    throw error;
  }
}

/**
 * 加载表情反应数据
 * @returns 表情反应数据数组
 */
export async function loadReactionsData(): Promise<Reaction[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.REACTIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('加载表情反应数据失败:', error);
    throw error;
  }
}
