import type {
  CatalogItem,
  Translations,
  Item,
  Villager,
  NPC,
  Creature,
  Reaction,
} from "../types";
import type { Recipe } from "../types/recipe";
import type { Construction } from "../types/construction";
import type { MessageCard } from "../types/messagecard";
import { CONFIG } from "../config";
import { ItemCategory, Version, ItemSize, Color } from "../types/item";
import { PERSONALITY_MAP } from "../constants";

let translationsCache: Translations | null = null;

// 反向映射：数字到字符串
export const ItemCategoryNameMap: Record<ItemCategory, string> = {
  [ItemCategory.Housewares]: "家具/家具",
  [ItemCategory.Miscellaneous]: "家具/小物件",
  [ItemCategory.WallMounted]: "家具/壁挂物",
  [ItemCategory.CeilingDecor]: "家具/天花板",
  [ItemCategory.InteriorStructures]: "家具/其他",
  [ItemCategory.Tops]: "服饰/上装",
  [ItemCategory.Bottoms]: "服饰/下装",
  [ItemCategory.DressUp]: "服饰/套装",
  [ItemCategory.Headwear]: "服饰/头戴物",
  [ItemCategory.Accessories]: "服饰/饰品",
  [ItemCategory.Socks]: "服饰/袜子",
  [ItemCategory.Shoes]: "服饰/鞋子",
  [ItemCategory.Bags]: "服饰/包包",
  [ItemCategory.Umbrellas]: "服饰/雨伞",
  [ItemCategory.ClothingOther]: "服饰/其他",
  [ItemCategory.ToolsGoods]: "工具",
  [ItemCategory.Fencing]: "栅栏",
  [ItemCategory.Wallpaper]: "壁纸",
  [ItemCategory.Floors]: "地板",
  [ItemCategory.Rugs]: "地垫",
  [ItemCategory.Fossils]: "化石",
  [ItemCategory.Gyroids]: "陶俑",
  [ItemCategory.Artwork]: "艺术品",
  [ItemCategory.Music]: "音乐",
  [ItemCategory.Photos]: "照片",
  [ItemCategory.Posters]: "海报",
  [ItemCategory.MessageCards]: "留言卡",
  [ItemCategory.Other]: "其他",
};

export const versionNameMap: Record<Version, string> = {
  [Version.The100]: "1.0.0",
  [Version.The110]: "1.1.0",
  [Version.The120]: "1.2.0",
  [Version.The130]: "1.3.0",
  [Version.The140]: "1.4.0",
  [Version.The150]: "1.5.0",
  [Version.The160]: "1.6.0",
  [Version.The170]: "1.7.0",
  [Version.The180]: "1.8.0",
  [Version.The190]: "1.9.0",
  [Version.The1100]: "1.10.0",
  [Version.The1110]: "1.11.0",
  [Version.The200]: "2.0.0",
  [Version.The204]: "2.0.4",
};

export const itemSizeNameMap: Record<ItemSize, string> = {
  [ItemSize.The05X1]: "0.5x1",
  [ItemSize.The1X05]: "1x0.5",
  [ItemSize.The1X1]: "1x1",
  [ItemSize.The1X15]: "1x1.5",
  [ItemSize.The15X15]: "1.5x1.5",
  [ItemSize.The1X2]: "1x2",
  [ItemSize.The2X05]: "2x0.5",
  [ItemSize.The2X1]: "2x1",
  [ItemSize.The2X15]: "2x1.5",
  [ItemSize.The2X2]: "2x2",
  [ItemSize.The3X1]: "3x1",
  [ItemSize.The3X2]: "3x2",
  [ItemSize.The3X3]: "3x3",
  [ItemSize.The4X3]: "4x3",
  [ItemSize.The4X4]: "4x4",
  [ItemSize.The5X5]: "5x5",
};

export const colorNameMap: Record<Color, string> = {
  [Color.Red]: "红色",
  [Color.Orange]: "橙色",
  [Color.Yellow]: "黄色",
  [Color.Green]: "绿色",
  [Color.Blue]: "蓝色",
  [Color.Aqua]: "青色",
  [Color.Purple]: "紫色",
  [Color.Pink]: "粉色",
  [Color.White]: "白色",
  [Color.Black]: "黑色",
  [Color.Gray]: "灰色",
  [Color.Brown]: "棕色",
  [Color.Beige]: "米色",
  [Color.Colorful]: "彩色",
};

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
    console.error("加载翻译数据失败:", error);
    // 返回空翻译对象作为降级方案
    return { sources: {}, tags: {}, series: {}, hobbys: {}, species: {}, concepts: {}, styles: {}, sets: {} };
  }
}

/**
 * 加载物品数据
 * @returns 原始物品数据数组
 */
export async function loadItemsData(): Promise<Item[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.ITEMS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载物品数据失败:", error);
    throw error;
  }
}

/**
 * 加载目录数据（用户拥有的物品）
 * @returns 包含拥有物品名称和ID集合的对象
 */
export async function loadCatalogData(): Promise<Set<number>> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    if (!response.ok) {
      console.log("无法加载 catalog_items.json，将不显示拥有状态");
      return new Set();
    }

    const data: { items: CatalogItem[] } = await response.json();
    const ownedIds = new Set<number>();

    data.items.forEach((item) => {
      ownedIds.add(item.unique_id);
    });
    console.log(`已加载 ${ownedIds.size} 个拥有的物品`);
    return ownedIds;
  } catch (error) {
    console.log("无法加载 catalog_items.json，将不显示拥有状态");
    return new Set();
  }
}

/**
 * 获取翻译文本的通用函数
 * @param key 翻译键
 * @param translationMap 翻译映射表
 * @returns 翻译后的文本，如果没有找到则返回原键
 */
function getTranslation(
  key: string,
  translationMap: Record<string, string> | undefined
): string {
  return translationMap?.[key] || key;
}

/**
 * 获取分类名称
 * @param category 分类键（数字或字符串）
 * @returns 枚举键名
 */
export function getCategoryName(category: ItemCategory): string {
  return ItemCategoryNameMap[category] || "";
}

/**
 * 获取版本名称
 * @param ver 版本键（数字）
 * @returns 版本字符串
 */
export function getVersionName(ver: Version): string {
  return versionNameMap[ver] || "";
}

/**
 * 获取尺寸名称
 * @param size 尺寸键（数字）
 * @returns 尺寸字符串
 */
export function getSizeName(size: ItemSize): string {
  return itemSizeNameMap[size] || "";
}

/**
 * 获取颜色名称
 * @param color 颜色键（数字或字符串）
 * @returns 翻译后的颜色名称
 */
export function getColorName(color: Color | string): string {
  if (typeof color === "string") {
    color = Object.entries(Color).find(([k]) => k === color)?.[1] as Color;
  } 
  return colorNameMap[color] || "";
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
 * 获取爱好名称
 * @param hobby 爱好键
 * @returns 翻译后的爱好名称
 */
export function getHobbyName(hobby: string): string {
  return getTranslation(hobby, translationsCache?.hobbys);
}

/**
 * 获取物种名称
 * @param species 物种键
 * @returns 翻译后的物种名称
 */
export function getSpeciesName(species: string): string {
  return getTranslation(species, translationsCache?.species);
}

/**
 * 获取概念名称
 * @param concept 概念键
 * @returns 翻译后的概念名称
 */
export function getConceptName(concept: string): string {
  return getTranslation(concept, translationsCache?.concepts);
}

/**
 * 获取风格名称
 * @param style 风格键
 * @returns 翻译后的风格名称
 */
export function getStyleName(style: string): string {
  return getTranslation(style, translationsCache?.styles);
}

/**
 * 获取主题名称
 * @param theme 主题键
 * @returns 翻译后的主题名称
 */
export function getThemeName(theme: string): string {
  return getTranslation(theme, translationsCache?.series);
}

/**
 * 获取套组名称
 * @param set 套组键
 * @returns 翻译后的套组名称
 */
export function getSetName(set: string): string {
  return getTranslation(set, translationsCache?.sets);
}

export function getPersonalityName(personality: string): string {
  return PERSONALITY_MAP[personality] || personality;
};
export function getGenderName(gender: string): string {
  if (gender === "Male") return "男性";
  if (gender === "Female") return "女性";
  return gender;
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
    console.error("加载村民数据失败:", error);
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
    console.error("加载NPC数据失败:", error);
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
    console.error("加载生物数据失败:", error);
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
    console.error("加载表情反应数据失败:", error);
    throw error;
  }
}

/**
 * 加载DIY配方数据
 * @returns DIY配方数据数组
 */
export async function loadRecipesData(): Promise<Recipe[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.RECIPES);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载DIY配方数据失败:", error);
    throw error;
  }
}

/**
 * 加载改建数据
 * @returns 改建数据数组
 */
export async function loadConstructionData(): Promise<Construction[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CONSTRUCTION);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载改建数据失败:", error);
    throw error;
  }
}

/**
 * 加载消息卡片数据
 * @returns 消息卡片数据数组
 */
export async function loadMessageCardsData(): Promise<MessageCard[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.MESSAGE_CARDS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载消息卡片数据失败:", error);
    throw error;
  }
}
