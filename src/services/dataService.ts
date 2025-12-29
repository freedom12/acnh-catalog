import {
  type CatalogItem,
  type Translations,
  type Item,
  type Villager,
  type NPC,
  type Creature,
  type Reaction,
  type Artwork,
  type Fossil,
  CreatureType,
  Gender,
  Personality,
  Hobby,
  Species,
} from "../types";
import { RecipeType, type Recipe } from "../types/recipe";

import { ConstructionType, type Construction } from "../types/construction";
import type { MessageCard } from "../types/messagecard";
import { CONFIG } from "../config";
import { ItemType, Version, ItemSize, Color } from "../types/item";
import { ENTITY_ICONS } from "../constants";

let translationsCache: Translations | null = null;

export const ItemTypeNameMap: Record<ItemType, string> = {
  [ItemType.Housewares]: "家具/家具",
  [ItemType.Miscellaneous]: "家具/小物件",
  [ItemType.WallMounted]: "家具/壁挂物",
  [ItemType.CeilingDecor]: "家具/天花板",
  [ItemType.InteriorStructures]: "家具/其他",
  [ItemType.Tops]: "服饰/上装",
  [ItemType.Bottoms]: "服饰/下装",
  [ItemType.DressUp]: "服饰/套装",
  [ItemType.Headwear]: "服饰/头戴物",
  [ItemType.Accessories]: "服饰/饰品",
  [ItemType.Socks]: "服饰/袜子",
  [ItemType.Shoes]: "服饰/鞋子",
  [ItemType.Bags]: "服饰/包包",
  [ItemType.Umbrellas]: "服饰/雨伞",
  [ItemType.ClothingOther]: "服饰/其他",
  [ItemType.ToolsGoods]: "工具",
  [ItemType.Fencing]: "栅栏",
  [ItemType.Wallpaper]: "壁纸",
  [ItemType.Floors]: "地板",
  [ItemType.Rugs]: "地垫",
  [ItemType.Creature]: "博物馆/生物",
  [ItemType.Fossils]: "博物馆/化石",
  [ItemType.Artwork]: "博物馆/艺术品",
  [ItemType.Gyroids]: "陶俑",
  [ItemType.Music]: "音乐",
  [ItemType.Photos]: "照片",
  [ItemType.Posters]: "海报",
  [ItemType.Other]: "其他",
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

export const RecipeTypeNameMap: Record<RecipeType, string> = {
  [RecipeType.Tools]: "工具",
  [RecipeType.Housewares]: "家具",
  [RecipeType.Miscellaneous]: "小物件",
  [RecipeType.WallMounted]: "壁挂物",
  [RecipeType.CeilingDecor]: "天花板",
  [RecipeType.Wallpaper]: "墙壁",
  [RecipeType.Floors]: "地板",
  [RecipeType.Rugs]: "地垫",
  [RecipeType.Equipment]: "装备",
  [RecipeType.Other]: "其他",
  [RecipeType.Savory]: "食物",
  [RecipeType.Sweet]: "点心",
};

export const CreatureTypeNameMap: Record<CreatureType, string> = {
  [CreatureType.Insects]: "昆虫",
  [CreatureType.Fish]: "鱼类",
  [CreatureType.SeaCreatures]: "海洋生物",
};

function getTranslation(
  key: string,
  translationMap: Record<string, string> | undefined
): string {
  return translationMap?.[key] || key;
}

export function getItemTypeName(type: ItemType): string {
  return ItemTypeNameMap[type];
}

export function getVersionName(ver: Version): string {
  return versionNameMap[ver];
}

export function getSizeName(size: ItemSize): string {
  return itemSizeNameMap[size];
}

export function getColorName(color: Color | string): string {
  if (typeof color === "string") {
    color = Object.entries(Color).find(([k]) => k === color)?.[1] as Color;
  }
  return colorNameMap[color];
}

export function getSourceName(source: string): string {
  return getTranslation(source, translationsCache?.sources);
}

export function getTagName(tag: string): string {
  return getTranslation(tag, translationsCache?.tags);
}

export function getHHASeriesName(series: string): string {
  return getTranslation(series, translationsCache?.series);
}

export function getHHASetName(set: string): string {
  return getTranslation(set, translationsCache?.sets);
}

export function getHHAConceptName(concept: string): string {
  return getTranslation(concept, translationsCache?.concepts);
}

export function getHHACategoryName(category: string): string {
  return getTranslation(category, translationsCache?.categories);
}

export function getClothingStyleName(style: string): string {
  return getTranslation(style, translationsCache?.styles);
}

export function getClothingThemeName(theme: string): string {
  return getTranslation(theme, translationsCache?.themes);
}

export function getRecipeTypeName(type: RecipeType): string {
  return RecipeTypeNameMap[type] || "";
}

export function getSeasonEventName(seasonEvent: string): string {
  return getTranslation(seasonEvent, translationsCache?.seasonEvents);
}

export function getCreatureTypeName(type: CreatureType): string {
  return CreatureTypeNameMap[type];
}

export const PersonalityNameMap: Record<Personality, string> = {
  [Personality.Cranky]: "暴躁",
  [Personality.Jock]: "运动",
  [Personality.Lazy]: "悠闲",
  [Personality.Smug]: "自恋",
  [Personality.Normal]: "普通",
  [Personality.Peppy]: "元气",
  [Personality.Snooty]: "成熟",
  [Personality.BigSister]: "大姐姐",
} as const;

export const HobbyNameMap: Record<Hobby, string> = {
  [Hobby.Education]: "教育",
  [Hobby.Fashion]: "时尚",
  [Hobby.Fitness]: "健身",
  [Hobby.Music]: "音乐",
  [Hobby.Nature]: "自然",
  [Hobby.Play]: "游戏",
};

export const SpeciesNameMap: Record<Species, string> = {
  [Species.Alligator]: "鳄鱼",
  [Species.Anteater]: "食蚁兽",
  [Species.Bear]: "熊",
  [Species.BearCub]: "熊仔",
  [Species.Bird]: "鸟",
  [Species.Bull]: "公牛",
  [Species.Cat]: "猫",
  [Species.Chicken]: "鸡",
  [Species.Cow]: "奶牛",
  [Species.Deer]: "鹿",
  [Species.Dog]: "狗",
  [Species.Duck]: "鸭",
  [Species.Eagle]: "鹰",
  [Species.Elephant]: "大象",
  [Species.Frog]: "青蛙",
  [Species.Goat]: "山羊",
  [Species.Gorilla]: "大猩猩",
  [Species.Hamster]: "仓鼠",
  [Species.Hippo]: "河马",
  [Species.Horse]: "马",
  [Species.Kangaroo]: "袋鼠",
  [Species.Koala]: "考拉",
  [Species.Lion]: "狮子",
  [Species.Monkey]: "猴子",
  [Species.Mouse]: "老鼠",
  [Species.Octopus]: "章鱼",
  [Species.Ostrich]: "鸵鸟",
  [Species.Penguin]: "企鹅",
  [Species.Pig]: "猪",
  [Species.Rabbit]: "兔子",
  [Species.Rhinoceros]: "犀牛",
  [Species.Sheep]: "绵羊",
  [Species.Squirrel]: "松鼠",
  [Species.Tiger]: "老虎",
  [Species.Wolf]: "狼",
} as const;

export function getPersonalityName(personality: Personality): string {
  return PersonalityNameMap[personality];
}

export function getHobbyName(hobby: Hobby): string {
  return HobbyNameMap[hobby];
}

export function getSpeciesName(species: Species): string {
  return SpeciesNameMap[species];
}

export function getGenderName(gender: Gender): string {
  if (gender === Gender.Male) return "男性";
  if (gender === Gender.Female) return "女性";
  return gender;
}

export function getGenderIcon(gender: Gender): string {
  return gender === Gender.Male ? ENTITY_ICONS.MALE : ENTITY_ICONS.FEMALE;
}

export const ConstructionTypeNameMap: Record<ConstructionType, string> = {
  [ConstructionType.Bridge]: "桥梁",
  [ConstructionType.Door]: "门",
  [ConstructionType.Incline]: "斜坡",
  [ConstructionType.Mailbox]: "信箱",
  [ConstructionType.Roofing]: "屋顶",
  [ConstructionType.Siding]: "外墙",
  [ConstructionType.Other]: "建筑",
};

export function getConstrunctionTypeName(type: ConstructionType): string {
  return ConstructionTypeNameMap[type];
}

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

export async function loadConstructionsData(): Promise<Construction[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CONSTRUCTIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载改建数据失败:", error);
    throw error;
  }
}

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

export async function loadArtworkData(): Promise<Artwork[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.ARTWORKS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载艺术品数据失败:", error);
    throw error;
  }
}

export async function loadFossilsData(): Promise<Fossil[]> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.FOSSILS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("加载化石数据失败:", error);
    throw error;
  }
}

export async function loadTranslations(): Promise<Translations> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Translations = await response.json();
    translationsCache = data;
    return data;
  } catch (error) {
    console.error("加载翻译数据失败:", error);
    throw error;
  }
}
