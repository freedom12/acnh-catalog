import type { CusCost, Price } from '../services/dataService';

/**
 * 物品分类枚举（数字枚举）
 */
export const ItemType = {
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
  Creature: 21,
  Fossils: 22,
  Artwork: 23,
  Gyroids: 24,
  Music: 25,
  Photos: 26,
  Posters: 27,
  Other: 28,
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];
export const FurnitureTypes: ItemType[] = [
  ItemType.Housewares,
  ItemType.Miscellaneous,
  ItemType.WallMounted,
  ItemType.CeilingDecor,
  ItemType.InteriorStructures,
];
export const ClothingTypes: ItemType[] = [
  ItemType.Tops,
  ItemType.Bottoms,
  ItemType.DressUp,
  ItemType.Headwear,
  ItemType.Accessories,
  ItemType.Socks,
  ItemType.Shoes,
  ItemType.Bags,
  ItemType.Umbrellas,
  ItemType.ClothingOther,
];

export const MuseumTypes: ItemType[] = [
  ItemType.Creature,
  ItemType.Fossils,
  ItemType.Artwork,
];

export const MiscTypes: ItemType[] = [
  ItemType.ToolsGoods,
  ItemType.Fencing,
  ItemType.Wallpaper,
  ItemType.Floors,
  ItemType.Rugs,
  ItemType.Fossils,
  ItemType.Gyroids,
  ItemType.Music,
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

export const Currency = {
  Bells: 1,
  HeartCrystals: 2,
  NookMiles: 3,
  NookPoints: 4,
  Poki: 5,
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const KitType = {
  Normal: 1,
  Pumpkin: 2,
  RainbowFeather: 3,
} as const;
export type KitType = (typeof KitType)[keyof typeof KitType];
/**
 * 图案接口
 * 表示物品的一个具体图案（如家具的不同花纹）
 */
export interface Pattern {
  name: string; // 图案名称
  image: string; // 图案图片
  id: number; // 图案ID
  colors: Color[]; // 图案颜色列表
  cus?: [number, CusCost]; // 定制价格和材料
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
 * 物品接口
 * 表示游戏中的一个物品
 */
export interface Item {
  id: number; // 物品ID
  order: number; // 物品排序
  name: string; // 物品名称
  rawName: string; // 物品原始名称
  images: string[]; // 物品所有图片
  type: ItemType; // 物品类型
  ver: Version; // 添加版本
  colors: Color[]; // 物品颜色列表
  size?: ItemSize; // 物品尺寸
  buy?: Price; // 购买价格
  sell?: Price; // 出售价格
  exch?: Price; // 兑换价格

  source?: string[]; // 获取来源
  sourceNotes?: string[];
  activity?: string;

  tag?: string; // 标签（家具）
  points?: number; // HHA积分
  series?: string; // HHA主题
  concepts?: string[]; // HHA场景
  set?: string; // HHA套组
  category?: string; // HHA分类

  themes?: string[]; // 服饰主题（棉儿要求）
  styles?: string[]; // 服饰风格（村民喜好）

  variants?: Variant[]; // 变体组列表
  vt?: string; // 变体标题
  pt?: string; // 图案标题
  iv?: boolean;
  ip?: boolean;
  recipe?: number; // 配方数据

  vfx?: boolean; // 是否有特效(壁纸/地板)
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

export const itemTagOrderList = [
  'Chair',
  'Sofa',
  'Desk',
  'Table',
  'Bed',
  'Chest',
  'Dresser',
  'Shelf',
  'Arch',
  'Screen',
  'Work Bench',
  'Kitchen',
  'Dining',
  'Kitchen Things',
  'DishFood',
  'DishDrink',
  'Lamp',
  'Audio',
  'TV',
  'Game Console',
  'TableClock',
  'Clock',
  'Musical Instrument',
  'Fan',
  'Fireplace',
  'Heating',
  'Home Appliances',
  'Air Conditioning',
  'Bathroom Things',
  'Bathtub',
  'Toilet',
  'Plants',
  'House Door Decor',
  'Bromide',
  'Posters',
  'CeilingLamp',
  'CeilingEtc',
  'Facility Decor',
  'Hospital',
  'Museum',
  'School',
  'Shop',
  'Supplies',
  'Office',
  'Study',
  'Seaside',
  'Space',
  'Vehicle',
  'Animal',
  'Fish',
  'Insect',
  'Playground',
  'Sports',
  'Toy',
  'Special Fish',
  'Special Insect',
  'Garden',
  'Ranch',
  'Folk Craft Decor',
  'Japanese Style',
  'Compass',
  'Easter',
  'Seasonal Decor',
  'Cinnamoroll',
  'Hello Kitty',
  'Kerokerokeroppi',
  'Kiki & Lala',
  'My Melody',
  'Pompompurin',
  'Mario',
] as const;

const itemTagOrderCache: Record<string, number> = itemTagOrderList.reduce(
  (acc, tag, idx) => {
    acc[tag] = idx + 1;
    return acc;
  },
  {} as Record<string, number>
);

export const getItemTagOrder = (tag: string): number => {
  return itemTagOrderCache[tag] ?? 999999;
};

export const housewareTagGroups = [
  ['Chair', 'Sofa'],
  ['Desk', 'Table'],
  ['Bed'],
  ['Chest', 'Dresser', 'Shelf'],
  ['Arch', 'Screen'],
  ['Work Bench'],
  ['Kitchen', 'Dining', 'Kitchen Things'],
  ['Lamp'],
  ['Audio', 'TV', 'Game Console'],
  ['Musical Instrument'],
  ['Fan', 'Fireplace', 'Heating', 'Home Appliances'],
  ['Bathroom Things', 'Bathtub', 'Toilet'],
  ['Plants'],
  [
    'Facility Decor',
    'Hospital',
    'Museum',
    'School',
    'Shop',
    'Supplies',
    'Office',
    'Study',
  ],
  ['Seaside', 'Space', 'Vehicle'],
  [
    'Animal',
    'Fish',
    'Insect',
    'Playground',
    'Sports',
    'Toy',
    'Special Fish',
    'Special Insect',
  ],
  ['Garden', 'Ranch'],
  ['Folk Craft Decor', 'Japanese Style'],
  [
    'Compass',
    'Easter',
    'Seasonal Decor',
    'Cinnamoroll',
    'Hello Kitty',
    'Kerokerokeroppi',
    'Kiki & Lala',
    'My Melody',
    'Pompompurin',
    'Mario',
  ],
];

export const miscellaneousTagGroups = [
  ['Chair'],
  ['Desk', 'Dresser'],
  ['Kitchen', 'Dining', 'Kitchen Things'],
  ['DishFood'],
  ['DishDrink'],
  ['Lamp'],
  ['Audio', 'TV', 'Game Console', 'TableClock'],
  ['Musical Instrument'],
  ['Bathroom Things', 'Bathtub', 'Toilet'],
  ['Plants'],
  [
    'Facility Decor',
    'Hospital',
    'Museum',
    'School',
    'Shop',
    'Supplies',
    'Office',
    'Study',
  ],
  ['Seaside', 'Space', 'Vehicle'],
  [
    'Animal',
    'Fish',
    'Insect',
    'Playground',
    'Sports',
    'Toy',
    'Special Fish',
    'Special Insect',
  ],
  ['Folk Craft Decor', 'Japanese Style'],
  [
    'Compass',
    'Easter',
    'Seasonal Decor',
    'Cinnamoroll',
    'Hello Kitty',
    'Kerokerokeroppi',
    'Kiki & Lala',
    'My Melody',
    'Pompompurin',
    'Mario',
  ],
];

const housewareTagGroupCache: Record<string, number> = housewareTagGroups.reduce(
  (acc, group, groupIdx) => {
    group.forEach((tag) => {
      acc[tag] = groupIdx + 1; // 1-based group index
    });
    return acc;
  },
  {} as Record<string, number>
);

const miscellaneousTagGroupCache: Record<string, number> = miscellaneousTagGroups.reduce(
  (acc, group, groupIdx) => {
    group.forEach((tag) => {
      acc[tag] = groupIdx + 1; // 1-based group index
    });
    return acc;
  },
  {} as Record<string, number>
);

export const getHousewareTagGroupIndex = (tag: string): number => {
  return housewareTagGroupCache[tag] ?? 9999;
};

export const getMiscellaneousTagGroupIndex = (tag: string): number => {
  return miscellaneousTagGroupCache[tag] ?? 9999;
};