import * as fs from 'fs';
import * as path from 'path';
import { ItemSourceSheet, type Item as OldItem } from 'animal-crossing/lib/types/Item';
import { items as oldItems, creatures as oldCreatures } from 'animal-crossing';
import { Catalog, KitType, type Item, type Variant } from '../src/types/item';
import { ItemType, Version, Color, Currency } from '../src/types/item';
import { type Activity } from '../src/types/activity';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util';
import { getAcnhItemData, getAllAcnhItemData } from './acnh/index.js';
import { genActivity } from './gen_activity';

const __dirname = path.join(process.cwd(), 'tools');

//#region v1
const sourceSheetMap: Record<string, ItemType> = {
  Accessories: ItemType.Accessories,
  Artwork: ItemType.Artwork,
  Bags: ItemType.Bags,
  Bottoms: ItemType.Bottoms,
  'Ceiling Decor': ItemType.CeilingDecor,
  'Clothing Other': ItemType.ClothingOther,
  'Dress-Up': ItemType.DressUp,
  Fencing: ItemType.Fencing,
  Floors: ItemType.Floors,
  Fossils: ItemType.Fossils,
  Gyroids: ItemType.Gyroids,
  Headwear: ItemType.Headwear,
  Housewares: ItemType.Housewares,
  Miscellaneous: ItemType.Miscellaneous,
  Music: ItemType.Music,
  Other: ItemType.Other,
  Photos: ItemType.Photos,
  Posters: ItemType.Posters,
  Rugs: ItemType.Rugs,
  Shoes: ItemType.Shoes,
  Socks: ItemType.Socks,
  'Tools/Goods': ItemType.ToolsGoods,
  Tops: ItemType.Tops,
  Umbrellas: ItemType.Umbrellas,
  'Wall-mounted': ItemType.WallMounted,
  Wallpaper: ItemType.Wallpaper,
  Creature: ItemType.Creature,
};

const catalogMap: Record<string, Catalog> = {
  'Not in catalog': Catalog.NotInCatalog,
  'Not for sale': Catalog.NotForSale,
  'For sale': Catalog.ForSale,
  Seasonal: Catalog.Seasonal,
};
const currencyMap: Record<string, Currency> = {
  Bells: Currency.Bells,
  'Heart Crystals': Currency.HeartCrystals,
  'Nook Miles': Currency.NookMiles,
  'Nook Points': Currency.NookPoints,
  Poki: Currency.Poki,
};

const kitTypeMap: Record<string, KitType> = {
  Normal: KitType.Normal,
  Pumpkin: KitType.Pumpkin,
  'Rainbow feather': KitType.RainbowFeather,
};

function processVariations(oldItem: OldItem): Variant[] {
  if (!oldItem.variations || oldItem.variations.length === 0) {
    return [];
  }

  const variants: Variant[] = [];
  const variantNamesSet = new Set<string>();
  oldItem.variations.forEach((v) => {
    const variantName = String(v.variation || '');
    if (!variantNamesSet.has(variantName)) {
      variants.push({ ps: [] });
      variantNamesSet.add(variantName);
    }

    const variant = variants[variants.length - 1];
    const patternColors = v.colors || oldItem.colors || [];
    variant.ps.push({
      id: v.internalId,
      cols: Array.from(
        new Set(patternColors.map((c) => colorMap[c]).filter((c) => c !== undefined))
      ),
    });
  });

  return variants;
}

function getDefaultDisplayProperties(
  oldItem: OldItem,
  variants: Variant[]
): { id: number; colors: Color[] } {
  let id = oldItem.internalId ?? 0;
  let colors = Array.from(
    new Set((oldItem.colors || []).map((c) => colorMap[c]).filter((c) => c !== undefined))
  );

  // 如果有变体，使用第一个变体的第一个图案
  if (variants.length > 0) {
    const firstVariant = variants[0];
    if (firstVariant && firstVariant.ps.length > 0) {
      const firstPattern = firstVariant.ps[0];
      if (firstPattern) {
        id = firstPattern.id || id;
        colors = firstPattern.cols || colors;
      }
    }
  }

  return { id, colors };
}

function convertItemFromOldItem(oldItem: OldItem): Item {
  const name = oldItem.translations?.cNzh || oldItem.name;
  const variants = processVariations(oldItem);
  const { id, colors } = getDefaultDisplayProperties(oldItem, variants);
  for (const variant of variants) {
    for (const pattern of variant.ps) {
      if (pattern.id === id) {
        pattern.id = undefined;
      }
    }
  }
  let vNames = [];
  let pNames = [];
  let vNamesSet = new Set<string>();
  let pNamesSet = new Set<string>();
  for (const variant of oldItem.variations || []) {
    let vName = String(variant.variantTranslations?.cNzh || variant.variation || '');
    if (!vNamesSet.has(vName)) {
      vNamesSet.add(vName);
      vNames.push(vName);
    }
    let pName = String(variant.patternTranslations?.cNzh || variant.pattern || '');
    if (!pNamesSet.has(pName)) {
      pNamesSet.add(pName);
      pNames.push(pName);
    }
  }

  let images = [];
  if (oldItem.inventoryImage) images.push(processImageUrl(oldItem.inventoryImage));
  if (oldItem.image) images.push(processImageUrl(oldItem.image));
  if (oldItem.storageImage) images.push(processImageUrl(oldItem.storageImage));
  if (oldItem.closetImage) images.push(processImageUrl(oldItem.closetImage));
  if (oldItem.framedImage) images.push(processImageUrl(oldItem.framedImage));
  if (oldItem.albumImage) images.push(processImageUrl(oldItem.albumImage));

  if (images.length === 0) {
    let variation = oldItem.variations?.[0];
    if (variation) {
      if (variation.image) images.push(processImageUrl(variation.image));
      if (variation.storageImage) images.push(processImageUrl(variation.storageImage));
      if (variation.closetImage) images.push(processImageUrl(variation.closetImage));
    }
  }
  if (oldItem.recipe) {
    images.push(processImageUrl(oldItem.recipe.image));
  }

  //特殊处理服饰变体
  let itemType = sourceSheetMap[oldItem.sourceSheet];
  if (oldItem.variations && oldItem.variations[0].closetImage) {
    for (const [i, v] of oldItem.variations.entries()) {
      let variant = variants[i]?.ps[0];
      if (variant && v.closetImage) {
        let str = path.basename(v.closetImage).slice(-5, -4);
        variant.i = Number(str);
      }
    }
  }
  let concepts = oldItem.concepts || oldItem.variations?.[0].concepts || undefined;
  concepts = concepts && concepts.length > 0 ? concepts : undefined;
  let category = oldItem.hhaCategory || oldItem.variations?.[0].hhaCategory || undefined;
  let clothGroupId = oldItem.clothGroupId || oldItem.variations?.[0].clothGroupId;
  let acnhItemData = getAcnhItemData(id, clothGroupId);
  if (!acnhItemData) {
    console.warn(`acnhItemData not found: id=${id}, name=${name}`);
  }
  let acts = acnhItemData?.evt;
  if (typeof acts === 'string') {
    acts = [acts];
  }

  let cusKitCost = oldItem.kitCost || 0;
  let kitType = oldItem.variations?.[0].kitType;
  let cusKitType = kitType ? kitTypeMap[kitType] : KitType.Normal;

  return {
    id,
    n: name,
    nr: oldItem.name,
    type: itemType,
    imgs: images,
    cols: colors,
    ver: oldItem.versionAdded ? versionMap[oldItem.versionAdded] : Version.The100,
    cat: oldItem.catalog ? catalogMap[oldItem.catalog] : Catalog.NotInCatalog,
    srcs: oldItem.source,
    srcN: oldItem.sourceNotes || undefined,
    acts: acts,
    size: oldItem.size ? sizeMap[oldItem.size] : undefined,
    tag: oldItem.tag,
    hpt: oldItem.hhaBasePoints || undefined,
    hser: oldItem.series || undefined,
    thms: oldItem.themes && oldItem.themes.length > 0 ? oldItem.themes : undefined,
    hset: oldItem.set || undefined,
    stls:
      oldItem.styles && oldItem.styles.length > 0
        ? Array.from(new Set(oldItem.styles))
        : undefined,
    hcpt: concepts,
    hcat: category,
    diy: oldItem.recipe ? oldItem.recipe.internalId : undefined,
    buy: oldItem.buy || undefined,
    sell: oldItem.sell || undefined,
    exch: oldItem.exchangePrice
      ? [oldItem.exchangePrice, currencyMap[oldItem.exchangeCurrency!]]
      : undefined,
    vs: variants.length > 0 ? variants : undefined,
    vt: oldItem.bodyTitle || undefined,
    pt: oldItem.variations?.[0].patternTitle || undefined,
    vn: vNames.length > 0 ? vNames : undefined,
    pn: pNames.length > 0 ? pNames : undefined,
    iv:
      oldItem.bodyCustomize || (acnhItemData && acnhItemData?.ccp)
        ? [oldItem.bodyCustomize ? 1 : 0, acnhItemData?.ccp || 0, acnhItemData?.nvc]
        : undefined,
    ip: oldItem.patternCustomize
      ? [oldItem.patternCustomize ? 1 : 0, acnhItemData?.spt ? 1 : 0, acnhItemData?.cpt ? 1 : 0]
      : undefined,
    cus: cusKitCost > 0 ? [cusKitCost, cusKitType] : undefined,
    vfx: oldItem.vfx || undefined,
  };
}

function applyOtherItemsOrder(
  itemMap: Map<number, Item>,
  orderFilePath: string,
  itemType: ItemType = ItemType.Other
) {
  if (!fs.existsSync(orderFilePath)) return;

  const lines = fs.readFileSync(orderFilePath, 'utf-8').split(/\r?\n/);
  let order = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^(\d+)\s+(.+)$/);
    if (!match) continue;

    const id = Number(match[1]);
    const name = match[2];
    const item = itemMap.get(id);

    if (!item) {
      console.log(`其他物品排序未找到: ${id} ${name}`);
      order += 1;
      continue;
    }

    if (item.type !== itemType) {
      console.log(`其他物品排序类型不匹配: ${id} ${name}`);
      order += 1;
      continue;
    }

    item.order = order;
    order += 1;
  }
}

export function genItemV1(activitys?: Activity[]): Item[] {
  activitys = activitys || genActivity();

  let items: Item[] = [];
  for (const oldItem of oldItems) {
    if (oldItem.sourceSheet !== ItemSourceSheet.MessageCards) {
      const newItem = convertItemFromOldItem(oldItem);
      items.push(newItem);
    }
  }

  for (const oldCreature of oldCreatures) {
    const item: Item = {
      id: oldCreature.internalId,
      order: oldCreature.num,
      n: oldCreature.translations?.cNzh || oldCreature.name,
      nr: oldCreature.name,
      imgs: [processImageUrl(oldCreature.furnitureImage)],
      type: ItemType.Creature,
      ver: oldCreature.versionAdded
        ? versionMap[oldCreature.versionAdded]
        : Version.The100,
      cols: Array.from(new Set(oldCreature.colors.map((c) => colorMap[c]))),
      cat: Catalog.NotForSale,
      size: sizeMap[oldCreature.size],
      sell: oldCreature.sell,
      hpt: oldCreature.hhaBasePoints,
      hcat: oldCreature.hhaCategory ?? undefined,
      tag: oldCreature.sourceSheet,
    };
    items.push(item);
  }

  const interiorStructures = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Interior Structures.json'), 'utf-8')
  );
  for (const structure of interiorStructures) {
    structure.colors = [structure.color1, structure.color2]; // 修正颜色字段
    if (structure.variations) {
      for (const variant of structure.variations) {
        variant.colors = [variant.color1, variant.color2]; // 修正变体颜色字段
      }
    }
    const newItem = convertItemFromOldItem(structure);
    newItem.type = ItemType.InteriorStructures;
    items.push(newItem);
  }

  items = sortItems(items);
  return items;
}

function sortItems(items: Item[]): Item[] {
  let itemMap = new Map<number, Item>();
  for (const item of items) {
    itemMap.set(item.id, item);
  }
  applyOtherItemsOrder(
    itemMap,
    path.join(__dirname, 'other-item-order.txt'),
    ItemType.Other
  );
  applyOtherItemsOrder(
    itemMap,
    path.join(__dirname, 'tools-item-order.txt'),
    ItemType.ToolsGoods
  );
  items.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type - b.type;
    }
    if (a.order !== b.order) {
      return (a.order ?? 999999) - (b.order ?? 999999);
    }
    return a.id - b.id;
  });
  return items;
}
//#endregion

//#region v2
const ItemTypeMapV2: Record<string, ItemType> = {
  housewares: ItemType.Housewares,
  misc: ItemType.Miscellaneous,
  wall_mounted: ItemType.WallMounted,
  walls: ItemType.Wallpaper,
  ceiling: ItemType.CeilingDecor,
  structures: ItemType.InteriorStructures,
  floors: ItemType.Floors,
  rugs: ItemType.Rugs,
  fencing: ItemType.Fencing,
  tops: ItemType.Tops,
  bottoms: ItemType.Bottoms,
  dresses: ItemType.DressUp,
  hats: ItemType.Headwear,
  accs: ItemType.Accessories,
  shoes: ItemType.Shoes,
  socks: ItemType.Socks,
  bags: ItemType.Bags,
  umbrellas: ItemType.Umbrellas,
  wetsuits: ItemType.ClothingOther,
  fossils: ItemType.Fossils,
  fish: ItemType.Creature,
  bugs: ItemType.Creature,
  sea: ItemType.Creature,
  art: ItemType.Artwork,
  photos: ItemType.Photos,
  posters: ItemType.Posters,
  music: ItemType.Music,
  gyroids: ItemType.Gyroids,
  tools: ItemType.ToolsGoods,
  other: ItemType.Other,
};

// todo 需要确认对应关系
const currencyMapV2: Record<number, Currency> = {
  1: Currency.Bells,
  2: Currency.HeartCrystals,
  3: Currency.NookMiles,
  4: Currency.NookPoints,
  5: Currency.Poki,
  6: Currency.HotelTickets,
};

function ensureArray(value: any): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return [value];
}

function replaceStr(str: string): string {
  // 下划线换为空格
  return str.replace(/_/g, ' ');
}

function convertItemFromAcnhItemData(
  id: string,
  typeName: string,
  acnhItemData: Record<string, any>
): Item {
  let img: string = acnhItemData.img;
  if (acnhItemData.ipf) {
    img = acnhItemData.ipf + acnhItemData.img[0];
  }
  img = 'https://nh-cdn.catalogue.ac/' + img + '.png';

  let item: Item = {
    id: Number(id.startsWith('c') ? acnhItemData.iid : id),
    order: 100000, //todo
    n: acnhItemData.loc['zh-cn'] || acnhItemData.loc['zh'],
    nr: acnhItemData.loc['en-us'] || acnhItemData.loc['en'],
    imgs: [img], //todo
    type: ItemTypeMapV2[typeName],
    ver: acnhItemData.vad ? versionMap[acnhItemData.vad] : Version.The100,
    cols: [Color.White],
    cat: Catalog.ForSale,
    buy: acnhItemData.buy,
    sell: acnhItemData.sel,
    exch: acnhItemData.exp
      ? [acnhItemData.exp, currencyMapV2[acnhItemData.exc]]
      : undefined,
    srcs: ensureArray(acnhItemData.src)?.map(replaceStr),
    acts: ensureArray(acnhItemData.evt),
    hpt: acnhItemData.hap,
    hser: acnhItemData.hat ? replaceStr(acnhItemData.hat) : undefined,
    hcpt: ensureArray(acnhItemData.has)?.map(replaceStr),
    hset: acnhItemData.hag ? replaceStr(acnhItemData.hag) : undefined,
    hcat: acnhItemData.hac ? replaceStr(acnhItemData.hac) : undefined,

    thms: ensureArray(acnhItemData.lbl)?.map(replaceStr),
    stls: ensureArray(acnhItemData.stl)?.map(replaceStr),
  };

  return item;
}

export function genItemV2(): Item[] {
  const acnhItemDatas = getAllAcnhItemData();
  let items: Item[] = [];
  for (const [typeName, map] of Object.entries(acnhItemDatas)) {
    console.log(`Processing category with ${typeName} items`);
    for (const [id, acnhItemData] of Object.entries(map)) {
      const newItem = convertItemFromAcnhItemData(id, typeName, acnhItemData);
      items.push(newItem);
    }
  }
  items = sortItems(items);
  return items;
}
//#endregion

export function mergeItemV1AndV2(): Item[] {
  const itemsV1 = genItemV1();
  const itemsV2 = genItemV2();
  let itemMapV1 = new Map<number, Item>();
  for (const item of itemsV1) {
    itemMapV1.set(item.id, item);
  }
  let itemMapV2 = new Map<number, Item>();
  for (const item of itemsV2) {
    itemMapV2.set(item.id, item);
  }

  // 定义优先使用 v2 的字段列表
  const v2Fields: (keyof Item)[] = ['acts'];

  let mergedMap = new Map<number, Item>();

  // 先添加所有 v1 物品
  for (const item of itemsV1) {
    mergedMap.set(item.id, { ...item });
  }

  // 处理 v2 物品
  for (const itemV2 of itemsV2) {
    const existingItem = mergedMap.get(itemV2.id);
    if (existingItem) {
      // 交集：合并，使用 v2Fields 从 v2，否则从 v1
      const mergedItem: Item = { ...existingItem };
      for (const field of v2Fields) {
        if (itemV2[field] !== undefined) {
          (mergedItem as any)[field] = itemV2[field];
        }
      }
      mergedMap.set(itemV2.id, mergedItem);
    } else {
      // v2 独有：直接添加
      mergedMap.set(itemV2.id, { ...itemV2 });
    }
  }

  let mergedItems: Item[] = Array.from(mergedMap.values());
  mergedItems = sortItems(mergedItems);
  return mergedItems;
}

export const genItem = genItemV1;

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  save(genItem(), 'acnh-items.json');
}
