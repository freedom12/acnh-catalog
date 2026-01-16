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

  const variantMap = new Map<string, Variant>();

  oldItem.variations.forEach((v) => {
    const variantName = String(v.variantTranslations?.cNzh || v.variation || '');

    if (!variantMap.has(variantName)) {
      variantMap.set(variantName, {
        name: variantName,
        ps: [],
      });
    }

    const variant = variantMap.get(variantName)!;
    const patternColors = v.colors || oldItem.colors || [];
    variant.ps.push({
      name: v.patternTranslations?.cNzh || v.pattern || '',
      image: processImageUrl(v.image || v.storageImage || v.closetImage || ''),
      id: v.internalId,
      colors: Array.from(
        new Set(patternColors.map((c) => colorMap[c]).filter((c) => c !== undefined))
      ),
    });
  });

  return Array.from(variantMap.values());
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
        colors = firstPattern.colors || colors;
      }
    }
  }

  return { id, colors };
}

function convertItemFromOldItem(oldItem: OldItem): Item {
  const name = oldItem.translations?.cNzh || oldItem.name;
  const variants = processVariations(oldItem);
  const { id, colors } = getDefaultDisplayProperties(oldItem, variants);

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
  if (id === 3333) {
    console.log(cusKitCost, cusKitType);
  }
  return {
    id,
    order: 100000,
    name,
    rawName: oldItem.name,
    type: sourceSheetMap[oldItem.sourceSheet],
    images,
    colors,
    ver: oldItem.versionAdded ? versionMap[oldItem.versionAdded] : Version.The100,
    cat: oldItem.catalog ? catalogMap[oldItem.catalog] : Catalog.NotInCatalog,
    source: oldItem.source,
    sourceNotes: oldItem.sourceNotes || undefined,
    acts: acts,
    size: oldItem.size ? sizeMap[oldItem.size] : undefined,
    tag: oldItem.tag,
    points: oldItem.hhaBasePoints || undefined,
    series: oldItem.series || undefined,
    themes: oldItem.themes && oldItem.themes.length > 0 ? oldItem.themes : undefined,
    set: oldItem.set || undefined,
    styles:
      oldItem.styles && oldItem.styles.length > 0
        ? Array.from(new Set(oldItem.styles))
        : undefined,
    concepts,
    category,
    recipe: oldItem.recipe ? oldItem.recipe.internalId : undefined,
    buy: oldItem.buy || undefined,
    sell: oldItem.sell || undefined,
    exch: oldItem.exchangePrice
      ? [oldItem.exchangePrice, currencyMap[oldItem.exchangeCurrency!]]
      : undefined,
    vs: variants.length > 0 ? variants : undefined,
    vt: oldItem.bodyTitle || undefined,
    pt: oldItem.variations?.[0].patternTitle || undefined,
    iv:
      oldItem.bodyCustomize || (acnhItemData && acnhItemData?.ccp)
        ? [!!oldItem.bodyCustomize, acnhItemData?.ccp || 0, acnhItemData?.nvc]
        : undefined,
    ip: oldItem.patternCustomize
      ? [!!oldItem.patternCustomize, !!acnhItemData?.spt, !!acnhItemData?.cpt]
      : undefined,
    cus: cusKitCost > 0 ? [cusKitCost, cusKitType] : undefined,
    vfx: oldItem.vfx || undefined,
  };
}

function convertItemFromAcnhItemData(
  id: string,
  acnhItemData: Record<string, any>
): Item {
  let img: string = acnhItemData.img;
  if (acnhItemData.ipf) {
    img = acnhItemData.ipf + acnhItemData.img[0];
  }
  img = 'https://nh-cdn.catalogue.ac/' + img + '.png';
  let item: Item = {
    id: Number(id.startsWith('c') ? acnhItemData.iid : id),
    order: 100000,
    name: acnhItemData.loc['zh-cn'] || acnhItemData.loc['zh'],
    rawName: acnhItemData.loc['en-us'] || acnhItemData.loc['en'],
    images: [img],
    type: ItemType.Other,
    ver: Version.The100,
    colors: [Color.White],
    cat: Catalog.NotInCatalog,
  };

  return item;
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
  let itemMap = new Map<number, Item>();
  for (const oldItem of oldItems) {
    if (oldItem.sourceSheet !== ItemSourceSheet.MessageCards) {
      const newItem = convertItemFromOldItem(oldItem);
      items.push(newItem);
      itemMap.set(newItem.id, newItem);
    }
  }

  for (const oldCreature of oldCreatures) {
    const item: Item = {
      id: oldCreature.internalId,
      order: oldCreature.num,
      name: oldCreature.translations?.cNzh || oldCreature.name,
      rawName: oldCreature.name,
      images: [processImageUrl(oldCreature.furnitureImage)],
      type: ItemType.Creature,
      ver: oldCreature.versionAdded
        ? versionMap[oldCreature.versionAdded]
        : Version.The100,
      colors: Array.from(new Set(oldCreature.colors.map((c) => colorMap[c]))),
      cat: Catalog.NotForSale,
      size: sizeMap[oldCreature.size],
      sell: oldCreature.sell,
      points: oldCreature.hhaBasePoints,
      category: oldCreature.hhaCategory ?? undefined,
      tag: oldCreature.sourceSheet,
    };
    items.push(item);
    itemMap.set(item.id, item);
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
    itemMap.set(newItem.id, newItem);
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
      return a.order - b.order;
    }
    return a.id - b.id;
  });
  return items;
}

export function genItemV2(): Item[] {
  const acnhItemDatas = getAllAcnhItemData();
  let items: Item[] = [];
  for (const [typeName, map] of Object.entries(acnhItemDatas)) {
    console.log(`Processing category with ${typeName} items`);
    for (const [id, acnhItemData] of Object.entries(map)) {
      const newItem = convertItemFromAcnhItemData(id, acnhItemData);
      items.push(newItem);
    }
  }
  return items;
}

export const genItem = genItemV1;

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genItem(), 'acnh-items.json');
}
