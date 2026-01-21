import type { CusCost, Price } from './index';

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
  Wetsuits: 15,
  ToolsGoods: 16,
  Fencing: 17,
  Wallpaper: 18,
  Floors: 19,
  Rugs: 20,
  Creatures: 21,
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
  ItemType.Wetsuits,
];

export const InteriorTypes: ItemType[] = [
  ItemType.Wallpaper,
  ItemType.Floors,
  ItemType.Rugs,
];

export const MuseumTypes: ItemType[] = [
  ItemType.Creatures,
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
  The300: 15,
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

export const Catalog = {
  NotInCatalog: 1,
  NotForSale: 2,
  ForSale: 3,
  Seasonal: 4,
} as const;
export type Catalog = (typeof Catalog)[keyof typeof Catalog];

export const Currency = {
  Bells: 1,
  HeartCrystals: 2,
  NookMiles: 3,
  NookPoints: 4,
  Poki: 5,
  HotelTickets: 6,
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const KitType = {
  Normal: 1,
  Pumpkin: 2,
  RainbowFeather: 3,
} as const;
export type KitType = (typeof KitType)[keyof typeof KitType];

export const InteractType = {
  Normal: 1,
  Bed: 2,
  Chair: 3,
  Kitchenware: 4,
  Mirror: 5,
  MusicPlayer: 6,
  MusicalInstrument: 7,
  Storage: 8,
  Toilet: 9,
  Trash: 10,
  TV: 11,
  Wardrobe: 12,
  Workbench: 13,
};
export type InteractType = (typeof InteractType)[keyof typeof InteractType];

export const SpeakerType = {
  HiFi: 1,
  Retro: 2,
  Cheap: 3,
  Phono: 4,
  MusicBox: 5,
} as const;
export type SpeakerType = (typeof SpeakerType)[keyof typeof SpeakerType];

export const LightType = {
  Candle: 1,
  Emission: 2,
  Fluorescent: 3,
  Monitor: 4,
  Shade: 5,
  Spotlight: 6,
} as const;
export type LightType = (typeof LightType)[keyof typeof LightType];

export const SoundType = {
  Crash: 1,
  DrumSet: 2,
  HiHat: 3,
  Kick: 4,
  Melody: 5,
  Snare: 6,
} as const;
export type SoundType = (typeof SoundType)[keyof typeof SoundType];

export const VfxType = {
  Normal: 1,
  LightOff: 2,
  Random: 3,
  Synchro: 4,
} as const;
export type VfxType = (typeof VfxType)[keyof typeof VfxType];
/**
 * 图案接口
 * 表示物品的一个具体图案（如家具的不同花纹）
 */
export interface Pattern {
  id?: number; // 服饰ID
  i?: string[]; // 服饰图片名字
  c: Color[]; // 图案颜色列表
}

/**
 * 变体接口
 * 表示物品的一个变体（如家具的不同款式）
 * 一个变体可以包含多个图案
 */
export type Variant = Pattern[];

/**
 * 物品接口
 * 表示游戏中的一个物品
 */
export interface Item {
  id: number; // 物品ID
  o?: number; // 物品排序
  n: string; // 物品名称
  nr: string; // 物品原始名称
  i: string[]; // 物品图片
  ic?: string; // 物品图标
  ict?: string; // 物品图标类型
  t: ItemType; // 物品类型
  v: Version; // 添加版本
  c: Color[]; // 物品颜色列表
  s?: ItemSize; // 物品尺寸
  cat: Catalog; // 目录状态
  buy?: Price; // 购买价格
  sel?: Price; // 出售价格
  exc?: Price; // 兑换价格

  srcs?: string[]; // 获取来源
  srcN?: string[];
  acts?: string[];

  tag?: string; // 标签（家具）
  hpt?: number; // HHA积分
  hser?: string; // HHA主题
  hcpt?: string[]; // HHA场景
  hset?: string; // HHA套组
  hcat?: string; // HHA分类

  thms?: string[]; // 服饰主题（棉儿要求）
  stls?: string[]; // 服饰风格（村民喜好）

  vs?: Variant[]; // 变体组列表
  vt?: string; // 变体标题
  pt?: string; // 图案标题
  vn?: string[]; // 变体名称列表
  pn?: string[]; // 图案名称列表
  iv?: [number, number, number?]; // 是否可改造样式/健兆改造花费/仅可通过健兆获得的款式index
  ip?: [number, number, number]; // 是否可改造图案/麻儿图案/我的设计
  cus?: CusCost; // 改造的消耗
  diy?: number; // 配方数据

  fd?: number; // 食物的饱腹度
  ss?: number; // 堆叠大小
  us?: number; // 使用次数

  iod?: boolean; // 是否为室外家具
  isf?: boolean; // 是否为有桌面
  idd?: boolean; // 是否为门饰

  it?: InteractType; // 互动类型
  st?: SpeakerType; // 音箱类型
  lt?: LightType; // 灯光类型
  sdt?: SoundType; // 声音类型(陶俑)
  vfxt?: VfxType; // 特效类型(壁纸/地板)
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
    'Zelda',
    'Splatoon',
    'LEGO'
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
    'Zelda',
    'Splatoon',
    'LEGO'
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
