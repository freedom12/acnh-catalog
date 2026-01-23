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
  PersonalityNameMap,
  HobbyNameMap,
  SpeciesNameMap,
  Constellation,
  ConstellationNameMap,
} from './mappings/villagerMappings';
import {
  ItemTypeNameMap,
  VersionNameMap,
  ItemSizeNameMap,
  ColorNameMap,
  CatalogNameMap,
  CurrencyNameMap,
} from './mappings/itemMappings';
import { RecipeTypeNameMap } from './mappings/recipeMappings';
import { CreatureTypeNameMap } from './mappings/creatureMappings';
import { ConstructionTypeNameMap } from './mappings/constructionMappings';
import { PlantTypeNameMap } from './mappings/plantMappings';
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
  return VersionNameMap[ver];
}

export function getSizeName(size: ItemSize): string {
  return ItemSizeNameMap[size];
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
  return ColorNameMap[color];
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
