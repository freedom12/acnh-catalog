import {
  type CatalogItem,
  type Translations,
  CreatureType,
  Gender,
  Personality,
  Hobby,
  Species,
  PlantType,
  type Price,
  type CusCost,
} from '../types';
import { RecipeType } from '../types/recipe';
import { ConstructionType } from '../types/construction';
import { BASE_PATH, CONFIG } from '../config';
import {
  ItemType,
  Version,
  ItemSize,
  Color,
  Currency,
  KitType,
  Catalog,
} from '../types/item';

export let translationsCache: Translations | null = null;

export const ItemTypeNameMap: Record<ItemType, string> = {
  [ItemType.Housewares]: '家具/家具',
  [ItemType.Miscellaneous]: '家具/小物件',
  [ItemType.WallMounted]: '家具/壁挂物',
  [ItemType.CeilingDecor]: '家具/天花板',
  [ItemType.InteriorStructures]: '家具/室内结构',
  [ItemType.Tops]: '服饰/上装',
  [ItemType.Bottoms]: '服饰/下装',
  [ItemType.DressUp]: '服饰/套装',
  [ItemType.Headwear]: '服饰/头戴物',
  [ItemType.Accessories]: '服饰/饰品',
  [ItemType.Socks]: '服饰/袜子',
  [ItemType.Shoes]: '服饰/鞋子',
  [ItemType.Bags]: '服饰/包包',
  [ItemType.Umbrellas]: '服饰/雨伞',
  [ItemType.Wetsuits]: '服饰/潜水服',
  [ItemType.ToolsGoods]: '工具',
  [ItemType.Fencing]: '栅栏',
  [ItemType.Wallpaper]: '壁纸',
  [ItemType.Floors]: '地板',
  [ItemType.Rugs]: '地垫',
  [ItemType.Creatures]: '博物馆/生物',
  [ItemType.Fossils]: '博物馆/化石',
  [ItemType.Artwork]: '博物馆/艺术品',
  [ItemType.Gyroids]: '陶俑',
  [ItemType.Music]: '音乐',
  [ItemType.Photos]: '照片',
  [ItemType.Posters]: '海报',
  [ItemType.Other]: '其他',
};

export const versionNameMap: Record<Version, string> = {
  [Version.The100]: '1.0.0',
  [Version.The110]: '1.1.0',
  [Version.The120]: '1.2.0',
  [Version.The130]: '1.3.0',
  [Version.The140]: '1.4.0',
  [Version.The150]: '1.5.0',
  [Version.The160]: '1.6.0',
  [Version.The170]: '1.7.0',
  [Version.The180]: '1.8.0',
  [Version.The190]: '1.9.0',
  [Version.The1100]: '1.10.0',
  [Version.The1110]: '1.11.0',
  [Version.The200]: '2.0.0',
  [Version.The204]: '2.0.4',
  [Version.The300]: '3.0.0',
};

export const itemSizeNameMap: Record<ItemSize, string> = {
  [ItemSize.The05X1]: '0.5x1',
  [ItemSize.The1X05]: '1x0.5',
  [ItemSize.The1X1]: '1x1',
  [ItemSize.The1X15]: '1x1.5',
  [ItemSize.The15X15]: '1.5x1.5',
  [ItemSize.The1X2]: '1x2',
  [ItemSize.The2X05]: '2x0.5',
  [ItemSize.The2X1]: '2x1',
  [ItemSize.The2X15]: '2x1.5',
  [ItemSize.The2X2]: '2x2',
  [ItemSize.The3X1]: '3x1',
  [ItemSize.The3X2]: '3x2',
  [ItemSize.The3X3]: '3x3',
  [ItemSize.The4X3]: '4x3',
  [ItemSize.The4X4]: '4x4',
  [ItemSize.The5X5]: '5x5',
};

export const colorNameMap: Record<Color, string> = {
  [Color.Red]: '红色',
  [Color.Orange]: '橙色',
  [Color.Yellow]: '黄色',
  [Color.Green]: '绿色',
  [Color.Blue]: '蓝色',
  [Color.Aqua]: '青色',
  [Color.Purple]: '紫色',
  [Color.Pink]: '粉色',
  [Color.White]: '白色',
  [Color.Black]: '黑色',
  [Color.Gray]: '灰色',
  [Color.Brown]: '棕色',
  [Color.Beige]: '米色',
  [Color.Colorful]: '彩色',
};

export const RecipeTypeNameMap: Record<RecipeType, string> = {
  [RecipeType.Tools]: '工具',
  [RecipeType.Housewares]: '家具',
  [RecipeType.Miscellaneous]: '小物件',
  [RecipeType.WallMounted]: '壁挂物',
  [RecipeType.CeilingDecor]: '天花板',
  [RecipeType.Wallpaper]: '墙壁',
  [RecipeType.Floors]: '地板',
  [RecipeType.Rugs]: '地垫',
  [RecipeType.Equipment]: '装备',
  [RecipeType.Other]: '其他',
  [RecipeType.Savory]: '食物',
  [RecipeType.Sweet]: '点心',
};

export const CatalogNameMap: Record<Catalog, string> = {
  [Catalog.NotInCatalog]: '不在目录中',
  [Catalog.NotForSale]: '非卖品',
  [Catalog.ForSale]: '售卖品',
  [Catalog.Seasonal]: '限定品',
};

export const CreatureTypeNameMap: Record<CreatureType, string> = {
  [CreatureType.Insects]: '昆虫',
  [CreatureType.Fish]: '鱼类',
  [CreatureType.SeaCreatures]: '海洋生物',
};

export const CurrencyNameMap: Record<Currency, string> = {
  [Currency.Bells]: '铃钱',
  [Currency.HeartCrystals]: '爱的结晶',
  [Currency.NookMiles]: 'Nook里程',
  [Currency.NookPoints]: 'Nook点数',
  [Currency.Poki]: '波金',
  [Currency.HotelTickets]: '旅店券',
};

export const getImgUrl = (path: string) => {
  return `${location.origin}${BASE_PATH}${path}`;
};

function getTranslation(
  key: string,
  translationMap: Record<string, string> | undefined
): string {
  key = key.trim();
  key = key.toLowerCase();
  return translationMap?.[key] || key;
}

export function getPriceStr(price: Price | null | undefined): string {
  if (!price) return '';
  if (price && !Array.isArray(price)) {
    price = [price, Currency.Bells];
  }
  let [amount, currency] = price as [number, Currency];
  if (amount < 0) return '';

  return `${amount.toLocaleString()} ${getCurrencyName(currency)}`;
}

export function getPriceWithIcon(price: Price | null | undefined): string {
  if (!price) return '';
  if (price && !Array.isArray(price)) {
    price = [price, Currency.Bells];
  }
  let [amount, currency] = price as [number, Currency];
  if (amount < 0) return '';

  const icon = getCurrencyIcon(currency);
  return `${amount.toLocaleString()} <img src="${icon}" alt="${getCurrencyName(
    currency
  )}" title="${getCurrencyName(currency)}" class="inline-icon" />`;
}

export function getKitTypeIcon(kitType: KitType): string {
  const iconMap: Record<KitType, string> = {
    [KitType.Normal]: getImgUrl('img/icon/kit_type_1.png'),
    [KitType.Pumpkin]: getImgUrl('img/icon/kit_type_2.png'),
    [KitType.RainbowFeather]: getImgUrl('img/icon/kit_type_3.png'),
  };
  return iconMap[kitType];
}

export function getKitTypeName(kitType: KitType): string {
  const nameMap: Record<KitType, string> = {
    [KitType.Normal]: '改造工具组',
    [KitType.Pumpkin]: '南瓜',
    [KitType.RainbowFeather]: '彩虹羽毛',
  };
  return nameMap[kitType];
}

export function getCusCost(cusCost: CusCost | null | undefined): string {
  if (!cusCost) return '';
  let [kitCost, kitType] = cusCost;
  if (kitCost <= 0) return '';
  const icon = getKitTypeIcon(kitType);
  return `${kitCost.toLocaleString()} <img src="${icon}" title="${getKitTypeName(kitType)}" class="inline-icon" />`;
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

export function getSizeIcon(size: ItemSize): string {
  const iconMap: Record<ItemSize, string> = {
    [ItemSize.The05X1]: 'Size_0.5_x_1.0.png',
    [ItemSize.The1X05]: 'Size_1.0_x_0.5.png',
    [ItemSize.The1X1]: 'Size_1.0_x_1.0.png',
    [ItemSize.The1X15]: 'Size_1.0_x_1.5.png',
    [ItemSize.The1X2]: 'Size_1.0_x_2.0.png',
    [ItemSize.The15X15]: 'Size_1.5_x_1.5.png',
    [ItemSize.The2X05]: 'Size_2.0_x_0.5.png',
    [ItemSize.The2X1]: 'Size_2.0_x_1.0.png',
    [ItemSize.The2X15]: 'Size_2.0_x_1.5.png',
    [ItemSize.The2X2]: 'Size_2.0_x_2.0.png',
    [ItemSize.The3X1]: 'Size_3.0_x_1.0.png',
    [ItemSize.The3X2]: 'Size_3.0_x_2.0.png',
    [ItemSize.The3X3]: 'Size_3.0_x_3.0.png',
    [ItemSize.The4X3]: 'Size_4.0_x_3.0.png',
    [ItemSize.The4X4]: 'Size_4.0_x_4.0.png',
    [ItemSize.The5X5]: 'Size_5.0_x_5.0.png',
  };
  return getImgUrl(`img/icon/size/${iconMap[size]}`);
}

export function getSizeWithIcon(size: ItemSize): string {
  const sizeName = getSizeName(size);
  const icon = getSizeIcon(size);
  if (!icon) return sizeName;
  return `${sizeName} <img src="${icon}" class="inline-icon" />`;
}

export function getColorName(color: Color | string): string {
  if (typeof color === 'string') {
    color = Object.entries(Color).find(([k]) => k === color)?.[1] as Color;
  }
  return colorNameMap[color];
}

export function getCatalogName(catalog: Catalog): string {
  return CatalogNameMap[catalog];
}

export function getCatalogIcon(catalog: Catalog): string {
  const iconMap: Record<Catalog, string> = {
    [Catalog.NotInCatalog]: '',
    [Catalog.NotForSale]: getImgUrl('img/icon/catalog_2.png'),
    [Catalog.ForSale]: getImgUrl('img/icon/catalog_3.png'),
    [Catalog.Seasonal]: getImgUrl('img/icon/catalog_4.png'),
  };
  return iconMap[catalog];
}

export function getCurrencyName(currency: Currency): string {
  return CurrencyNameMap[currency];
}

export function getCurrencyIcon(currency: Currency): string {
  return getImgUrl(`img/icon/currency_${currency}.png`);
}

export function getCreatureTypeIcon(type: CreatureType): string {
  const iconMap: Record<CreatureType, string> = {
    [CreatureType.Insects]: getImgUrl('img/icon/creature_type_1.png'),
    [CreatureType.Fish]: getImgUrl('img/icon/creature_type_2.png'),
    [CreatureType.SeaCreatures]: getImgUrl('img/icon/creature_type_3.png'),
  };
  return iconMap[type];
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
export function getHHASeriesOrder(): string[] {
  return Object.keys(translationsCache?.series || {});
}
export function getHHASetName(set: string): string {
  return getTranslation(set, translationsCache?.sets);
}

export function getHHASetsOrder(): string[] {
  return Object.keys(translationsCache?.sets || {});
}

export function getHHAConceptName(concept: string): string {
  return getTranslation(concept, translationsCache?.concepts);
}

export function getHHAConceptsOrder(): string[] {
  return Object.keys(translationsCache?.concepts || {});
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
  return RecipeTypeNameMap[type] || '';
}

export function getRecipeTypeIcon(type: RecipeType): string {
  return getImgUrl(`img/icon/recipe_type/recipe_type_${type}.png`);
}

export function getItemVariantTitle(title: string): string {
  return getTranslation(title, translationsCache?.itemVariantTitles);
}

export function getCreatureTypeName(type: CreatureType): string {
  return CreatureTypeNameMap[type];
}

export const PersonalityNameMap: Record<Personality, string> = {
  [Personality.Cranky]: '暴躁',
  [Personality.Jock]: '运动',
  [Personality.Lazy]: '悠闲',
  [Personality.Smug]: '自恋',
  [Personality.Normal]: '普通',
  [Personality.Peppy]: '元气',
  [Personality.Snooty]: '成熟',
  [Personality.BigSister]: '大姐姐',
} as const;

export const HobbyNameMap: Record<Hobby, string> = {
  [Hobby.Education]: '教育',
  [Hobby.Fashion]: '时尚',
  [Hobby.Fitness]: '健身',
  [Hobby.Music]: '音乐',
  [Hobby.Nature]: '自然',
  [Hobby.Play]: '游戏',
};

export const SpeciesNameMap: Record<Species, string> = {
  [Species.Alligator]: '鳄鱼',
  [Species.Anteater]: '食蚁兽',
  [Species.Bear]: '熊',
  [Species.BearCub]: '熊仔',
  [Species.Bird]: '鸟',
  [Species.Bull]: '公牛',
  [Species.Cat]: '猫',
  [Species.Chicken]: '鸡',
  [Species.Cow]: '奶牛',
  [Species.Deer]: '鹿',
  [Species.Dog]: '狗',
  [Species.Duck]: '鸭',
  [Species.Eagle]: '鹰',
  [Species.Elephant]: '大象',
  [Species.Frog]: '青蛙',
  [Species.Goat]: '山羊',
  [Species.Gorilla]: '大猩猩',
  [Species.Hamster]: '仓鼠',
  [Species.Hippo]: '河马',
  [Species.Horse]: '马',
  [Species.Kangaroo]: '袋鼠',
  [Species.Koala]: '考拉',
  [Species.Lion]: '狮子',
  [Species.Monkey]: '猴子',
  [Species.Mouse]: '老鼠',
  [Species.Octopus]: '章鱼',
  [Species.Ostrich]: '鸵鸟',
  [Species.Penguin]: '企鹅',
  [Species.Pig]: '猪',
  [Species.Rabbit]: '兔子',
  [Species.Rhinoceros]: '犀牛',
  [Species.Sheep]: '绵羊',
  [Species.Squirrel]: '松鼠',
  [Species.Tiger]: '老虎',
  [Species.Wolf]: '狼',
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

export function getSpeciesIcon(species: Species): string {
  return getImgUrl(`img/icon/species/species_${species}.png`);
}

export function getGenderName(gender: Gender): string {
  if (gender === Gender.Male) return '男性';
  if (gender === Gender.Female) return '女性';
  return gender;
}

export function getGenderIcon(gender: Gender): string {
  const iconMap: Record<Gender, string> = {
    [Gender.Male]: getImgUrl('img/icon/gender_2.png'),
    [Gender.Female]: getImgUrl('img/icon/gender_1.png'),
  };
  return iconMap[gender];
}

// 星座枚举
export const Constellation = {
  Aries: 1, // 白羊座
  Taurus: 2, // 金牛座
  Gemini: 3, // 双子座
  Cancer: 4, // 巨蟹座
  Leo: 5, // 狮子座
  Virgo: 6, // 处女座
  Libra: 7, // 天秤座
  Scorpio: 8, // 天蝎座
  Sagittarius: 9, // 射手座
  Capricorn: 10, // 魔羯座
  Aquarius: 11, // 水瓶座
  Pisces: 12, // 双鱼座
} as const;

export type Constellation = (typeof Constellation)[keyof typeof Constellation];

export const ConstellationNameMap: Record<Constellation, string> = {
  [Constellation.Aries]: '白羊座',
  [Constellation.Taurus]: '金牛座',
  [Constellation.Gemini]: '双子座',
  [Constellation.Cancer]: '巨蟹座',
  [Constellation.Leo]: '狮子座',
  [Constellation.Virgo]: '处女座',
  [Constellation.Libra]: '天秤座',
  [Constellation.Scorpio]: '天蝎座',
  [Constellation.Sagittarius]: '射手座',
  [Constellation.Capricorn]: '魔羯座',
  [Constellation.Aquarius]: '水瓶座',
  [Constellation.Pisces]: '双鱼座',
};
// 根据生日计算星座
export function getConstellation(birthday: string): Constellation {
  // birthday 格式如 "1/15" 或 "12/25"
  const [monthStr, dayStr] = birthday.split('/');
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!month || !day) return Constellation.Aries; // 默认返回白羊座

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return Constellation.Aries;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return Constellation.Taurus;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return Constellation.Gemini;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return Constellation.Cancer;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return Constellation.Leo;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return Constellation.Virgo;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return Constellation.Libra;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return Constellation.Scorpio;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return Constellation.Sagittarius;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return Constellation.Capricorn;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return Constellation.Aquarius;
  return Constellation.Pisces; // 2/19 - 3/20
}

export function getConstellationIcon(constellation: Constellation): string {
  return getImgUrl(`img/icon/constellation/constellation_${constellation}.png`);
}

export function getConstellationName(constellation: Constellation): string {
  return ConstellationNameMap[constellation];
}

export const ConstructionTypeNameMap: Record<ConstructionType, string> = {
  [ConstructionType.Roof]: '屋顶',
  [ConstructionType.Siding]: '墙壁',
  [ConstructionType.Door]: '门',
  [ConstructionType.Mailbox]: '信箱',
  [ConstructionType.Bridge]: '桥梁',
  [ConstructionType.Incline]: '斜坡',
  // [ConstructionType.Other]: '建筑',
};

export function getConstructionTypeName(type: ConstructionType): string {
  return ConstructionTypeNameMap[type];
}

export function getConstructionTypeIcon(type: ConstructionType): string {
  return getImgUrl(`img/icon/construction_type/construction_type_${type}.png`);
}

export function getItemTypeIcon(type: ItemType): string {
  return getImgUrl(`img/icon/item_type/item_type_${type}.png`);
}

export function getItemSubtypeIcon(type: ItemType, subtype: number): string {
  return getImgUrl(`img/icon/item_subtype/type_${type}_${subtype}.png`);
}

export const PlantTypeNameMap: Record<PlantType, string> = {
  [PlantType.Tree]: '树木',
  [PlantType.Bush]: '灌木',
  [PlantType.Crop]: '作物',
  [PlantType.Flower]: '花朵',
  [PlantType.Mushroom]: '菌类',
  [PlantType.Other]: '其他',
};
export function getPlantTypeName(type: PlantType): string {
  return PlantTypeNameMap[type];
}

export function getPlantTypeIcon(type: PlantType): string {
  return getImgUrl(`img/icon/plant_type/plant_type_${type}.png`);
}

export async function loadCatalogData(): Promise<Set<number>> {
  if (!import.meta.env.DEV) {
    return new Set();
  }

  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    if (!response.ok) {
      console.log('无法加载 catalog_items.json，将不显示拥有状态');
      return new Set();
    }

    const data: { items: CatalogItem[] } = (await response.json()) as {
      items: CatalogItem[];
    };
    const ownedIds = new Set<number>();

    data.items.forEach((item) => {
      ownedIds.add(item.unique_id);
    });
    console.log(`已加载 ${ownedIds.size} 个拥有的物品`);
    return ownedIds;
  } catch (error) {
    console.log('无法加载 catalog_items.json，将不显示拥有状态');
    return new Set();
  }
}

export async function loadTranslations(): Promise<Translations> {
  try {
    const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Translations = (await response.json()) as Translations;
    translationsCache = data;
    // 把key小写
    for (const sectionKey in data) {
      const section = data[sectionKey as keyof Translations];
      for (const [key, value] of Object.entries(section)) {
        delete section[key];
        section[key.toLowerCase()] = value;
      }
    }
    return data;
  } catch (error) {
    console.error('加载翻译数据失败:', error);
    throw error;
  }
}
