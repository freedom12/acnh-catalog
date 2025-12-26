/**
 * 物品分类枚举（数字枚举）
 */
export const ItemCategory = {
  Housewares: 1,
  Miscellaneous: 2,
  WallMounted: 3,
  CeilingDecor: 4,
  InteriorStructures: 5,
  Tops: 6,
  Bottoms: 7,
  DressUp: 8,
  Headwear: 9,
  Accessories: 10,
  Socks: 11,
  Shoes: 12,
  Bags: 13,
  Umbrellas: 14,
  ClothingOther: 15,
  ToolsGoods: 16,
  Fencing: 17,
  Wallpaper: 18,
  Floors: 19,
  Rugs: 20,
  Fossils: 21,
  Gyroids: 22,
  Artwork: 23,
  Music: 24,
  Photos: 25,
  Posters: 26,
  MessageCards: 27,
  Other: 28,
} as const;

export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];
export const FurnitureCategories: ItemCategory[] = [
  ItemCategory.Housewares,
  ItemCategory.Miscellaneous,
  ItemCategory.WallMounted,
  ItemCategory.CeilingDecor,
  ItemCategory.InteriorStructures,
];
export const ClothingCategories: ItemCategory[] = [
  ItemCategory.Tops,
  ItemCategory.Bottoms,
  ItemCategory.DressUp,
  ItemCategory.Headwear,
  ItemCategory.Accessories,
  ItemCategory.Socks,
  ItemCategory.Shoes,
  ItemCategory.Bags,
  ItemCategory.Umbrellas,
  ItemCategory.ClothingOther,
];
export const MiscCategories: ItemCategory[] = [
  ItemCategory.ToolsGoods,
  ItemCategory.Fencing,
  ItemCategory.Wallpaper,
  ItemCategory.Floors,
  ItemCategory.Rugs,
  ItemCategory.Fossils,
  ItemCategory.Gyroids,
  ItemCategory.Music,
];
/**
 * 版本添加枚举（数字枚举）
 */
export const Version = {
  The100: 1,
  The110: 2,
  The120: 3,
  The130: 4,
  The140: 5,
  The150: 6,
  The160: 7,
  The170: 8,
  The180: 9,
  The190: 10,
  The1100: 11,
  The1110: 12,
  The200: 13,
  The204: 14,
} as const;

export type Version = (typeof Version)[keyof typeof Version];

/**
 * 尺寸枚举（数字枚举）
 */
export const ItemSize = {
  The05X1: 1,
  The1X05: 2,
  The1X1: 3,
  The1X15: 4,
  The1X2: 5,
  The15X15: 6,
  The2X05: 7,
  The2X1: 8,
  The2X15: 9,
  The2X2: 10,
  The3X1: 11,
  The3X2: 12,
  The3X3: 13,
  The4X3: 14,
  The4X4: 15,
  The5X5: 16,
} as const;

export type ItemSize = (typeof ItemSize)[keyof typeof ItemSize];

/**
 * 颜色枚举（数字枚举）
 */
export const Color = {
  Red: 1,
  Orange: 2,
  Yellow: 3,
  Green: 4,
  Blue: 5,
  Aqua: 6,
  Purple: 7,
  Pink: 8,
  White: 9,
  Black: 10,
  Gray: 11,
  Brown: 12,
  Beige: 13,
  Colorful: 14,
} as const;

export type Color = (typeof Color)[keyof typeof Color];

/**
 * 图案接口
 * 表示物品的一个具体图案（如家具的不同花纹）
 */
export interface Pattern {
  name: string; // 图案名称
  image: string; // 图案图片
  id: number; // 图案ID
  colors: Color[]; // 图案颜色列表
}

/**
 * 变体接口
 * 表示物品的一个变体（如家具的不同款式）
 * 一个变体可以包含多个图案
 */
export interface Variant {
  name: string; // 变体名称
  patterns: Pattern[]; // 该变体的所有图案
}

/**
 * 配方数据接口
 * 表示DIY配方信息
 */
export interface RecipeData {
  name: string; // 配方名称
  image?: string; // 配方图片
  materials?: Record<string, number>; // 材料列表 {材料名: 数量}
  source?: string[]; // 配方来源
  sourceNotes?: string[]; // 来源备注
  seasonEvent?: string; // 季节活动
  ver?: Version; // 添加版本
  category?: string; // 配方分类
  buy?: number; // 购买价格
  sell?: number; // 出售价格
}

/**
 * 物品接口
 * 表示游戏中的一个物品
 */
export interface Item {
  id: number; // 物品ID
  name: string; // 物品名称
  rawName: string; // 物品原始名称
  images: string[]; // 物品所有图片
  category: ItemCategory; // 物品分类
  ver?: Version; // 添加版本
  size?: ItemSize; // 物品尺寸
  colors: Color[]; // 物品颜色列表
  buy?: number; // 购买价格
  sell?: number; // 出售价格
  source?: string[]; // 获取来源

  tag?: string; // 标签（家具）
  series?: string; // HHA主题（家具）
  concepts?: string[]; // HHA场景（家具/工具）
  set?: string; // HHA套组（家具/工具）
  themes?: string[]; // 服饰主题（棉儿要求）
  styles?: string[]; // 服饰风格（村民喜好）

  variants?: Variant[]; // 变体组列表
  recipe?: RecipeData; // 配方数据
}

/**
 * 目录物品接口
 * 用户拥有的物品数据结构
 */
export interface CatalogItem {
  label: string; // 物品标签
  unique_id: number; // 唯一ID
  kind_id?: string;
  price?: number;
  catalog_type?: string;
  item_size_id?: string;
  ui_category?: string;
  icon?: string;
  item_fossil_set_id?: number;
  hha_theme?: number;
  can_sell?: number;
  remakable?: boolean;
  color1?: string;
  color2?: string;
  from?: string;
  shop_remakable?: boolean;
}

/**
 * 筛选选项接口
 * 定义物品筛选的各种条件
 */
export interface FilterOptions {
  searchTerm: string; // 搜索关键词
  ownedFilter?: boolean; // 拥有状态筛选
  category?: ItemCategory; // 分类筛选（枚举键名）
  versionFilter?: Version; // 版本筛选（枚举键名）
  colorFilter?: Color; // 颜色筛选（枚举键名）
  sizeFilter?: ItemSize; // 尺寸筛选（枚举键名）
  sourceFilter: string; // 来源筛选
  tagFilter: string; // 标签筛选
  seriesFilter: string; // 系列筛选
  themeFilter: string; // 主题筛选
  styleFilter: string; // 风格筛选
}
