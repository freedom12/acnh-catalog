import * as fs from 'fs';
import * as path from 'path';
import { ItemSourceSheet, type Item as OldItem } from 'animal-crossing/lib/types/Item';
import { items as oldItems, creatures as oldCreatures } from 'animal-crossing';
import {
  Catalog,
  InteractType,
  KitType,
  LightType,
  SoundType,
  SpeakerType,
  VfxType,
  type Item,
  type Variant,
} from '../src/types/item';
import { ItemType, Version, Color, Currency } from '../src/types/item';
import { type Activity } from '../src/types/activity';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util';
import { getAcnhItemData, getAllAcnhItemData } from './acnh/index.js';
import { genActivity } from './gen_activity';
import { console } from 'inspector';

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

const interactTypeMap: Record<string, InteractType> = {
  Bed: InteractType.Bed,
  Chair: InteractType.Chair,
  Kitchenware: InteractType.Kitchenware,
  Mirror: InteractType.Mirror,
  'Music Player': InteractType.MusicPlayer,
  'Musical Instrument': InteractType.MusicalInstrument,
  Storage: InteractType.Storage,
  Toilet: InteractType.Toilet,
  Trash: InteractType.Trash,
  TV: InteractType.TV,
  Wardrobe: InteractType.Wardrobe,
  Workbench: InteractType.Workbench,
};

const speakerTypeMap: Record<string, SpeakerType> = {
  'Hi-fi': SpeakerType.HiFi,
  Retro: SpeakerType.Retro,
  Cheap: SpeakerType.Cheap,
  Phono: SpeakerType.Phono,
  'Music Box': SpeakerType.MusicBox,
};

const lightTypeMap: Record<string, LightType> = {
  Candle: LightType.Candle,
  Emission: LightType.Emission,
  Fluorescent: LightType.Fluorescent,
  Monitor: LightType.Monitor,
  Shade: LightType.Shade,
  Spotlight: LightType.Spotlight,
};

const soundTypeMap: Record<string, SoundType> = {
  Crash: SoundType.Crash,
  'Drum set': SoundType.DrumSet,
  'Hi-hat': SoundType.HiHat,
  Kick: SoundType.Kick,
  Melody: SoundType.Melody,
  Snare: SoundType.Snare,
};

const vfxTypeMap: Record<string, VfxType> = {
  LightOff: VfxType.LightOff,
  Random: VfxType.Random,
  Synchro: VfxType.Synchro,
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
      variants.push([]);
      variantNamesSet.add(variantName);
    }

    const variant = variants[variants.length - 1];
    const patternColors = v.colors || oldItem.colors || [];
    variant.push({
      id: v.internalId,
      c: Array.from(
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
    if (firstVariant && firstVariant.length > 0) {
      const firstPattern = firstVariant[0];
      if (firstPattern) {
        id = firstPattern.id || id;
        colors = firstPattern.c || colors;
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
    for (const pattern of variant) {
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
      let variant = variants[i]?.[0];
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
    // console.warn(`acnhItemData not found: id=${id}, name=${name}`);
  }
  let acts = acnhItemData?.evt;
  if (typeof acts === 'string') {
    acts = [acts];
  }

  let cusKitCost = oldItem.kitCost || 0;
  let kitType = oldItem.variations?.[0].kitType;
  let cusKitType = kitType ? kitTypeMap[kitType] : KitType.Normal;

  let useTimes = oldItem.uses || oldItem.variations?.[0].uses;
  useTimes = useTimes ? Number(useTimes) : undefined;

  let interactType: InteractType | undefined = undefined;
  if (oldItem.interact) {
    if (typeof oldItem.interact === 'string') {
      interactType = interactTypeMap[oldItem.interact];
    } else {
      interactType = InteractType.Normal;
    }
  }

  let speakerType: SpeakerType | undefined = undefined;
  if (oldItem.speakerType) {
    speakerType = speakerTypeMap[oldItem.speakerType];
  }

  let lightType: LightType | undefined = undefined;
  if (oldItem.lightingType) {
    lightType = lightTypeMap[oldItem.lightingType];
  }

  let soundType: SoundType | undefined = undefined;
  let st = oldItem.soundType || oldItem.variations?.[0].soundType;
  if (st) {
    soundType = soundTypeMap[st];
  }

  let vfxType: VfxType | undefined = undefined;
  if (oldItem.vfx) {
    if (oldItem.vfxType) {
      vfxType = vfxTypeMap[oldItem.vfxType];
    } else {
      vfxType = VfxType.Normal;
    }
  }

  // if (oldItem.seasonEvent && !oldItem.seasonEventExclusive) {
  //   console.log(`警告: 物品 ${id} ${name} 存在 seasonEvent 但没有 seasonEventExclusive`);
  // }
  // if (oldItem.seasonalAvailability) {
  //   console.log(
  //     `警告: 物品 ${id} ${name} 存在 seasonalAvailability`,
  //     oldItem.seasonalAvailability
  //   );
  // }
  // if (oldItem.seasonality || oldItem.variations?.[0].seasonality) {
  //   console.log(
  //     `警告: 物品 ${id} ${name} 存在 seasonality`,
  //     oldItem.seasonality || oldItem.variations?.[0].seasonality
  //   );
  // }
  // if (oldItem.mannequinSeason || oldItem.variations?.[0].mannequinSeason) {
  //   console.log(
  //     `警告: 物品 ${id} ${name} 存在 mannequinSeason`,
  //     oldItem.mannequinSeason || oldItem.variations?.[0].mannequinSeason
  //   );
  // }
  return {
    id,
    n: name,
    nr: oldItem.name,
    t: itemType,
    i: images,
    c: colors,
    v: oldItem.versionAdded ? versionMap[oldItem.versionAdded] : Version.The100,
    cat: oldItem.catalog ? catalogMap[oldItem.catalog] : Catalog.NotInCatalog,
    srcs: oldItem.source,
    srcN: oldItem.sourceNotes || undefined,
    acts: acts,
    s: oldItem.size ? sizeMap[oldItem.size] : undefined,
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
    sel: oldItem.sell || undefined,
    exc: oldItem.exchangePrice
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
      ? [
          oldItem.patternCustomize ? 1 : 0,
          acnhItemData?.spt ? 1 : 0,
          acnhItemData?.cpt ? 1 : 0,
        ]
      : undefined,
    cus: cusKitCost > 0 ? [cusKitCost, cusKitType] : undefined,

    fd: oldItem.foodPower || undefined,
    ss: oldItem.stackSize || undefined,
    us: useTimes,

    iod: oldItem.outdoor || undefined,
    isf: oldItem.surface || undefined,
    idd: oldItem.doorDeco || undefined,

    it: interactType,
    st: speakerType,
    lt: lightType,
    sdt: soundType,
    vfxt: vfxType,
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

    if (item.t !== itemType) {
      console.log(`其他物品排序类型不匹配: ${id} ${name}`);
      order += 1;
      continue;
    }

    item.o = order;
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
      o: oldCreature.num,
      n: oldCreature.translations?.cNzh || oldCreature.name,
      nr: oldCreature.name,
      i: [processImageUrl(oldCreature.furnitureImage)],
      t: ItemType.Creature,
      v: oldCreature.versionAdded ? versionMap[oldCreature.versionAdded] : Version.The100,
      c: Array.from(new Set(oldCreature.colors.map((c) => colorMap[c]))),
      cat: Catalog.NotForSale,
      s: sizeMap[oldCreature.size],
      sel: oldCreature.sell,
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
    newItem.t = ItemType.InteriorStructures;
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
    if (a.t !== b.t) {
      return a.t - b.t;
    }
    if (a.o !== b.o) {
      return (a.o ?? 999999) - (b.o ?? 999999);
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
    o: 100000, //todo
    n: acnhItemData.loc['zh-cn'] || acnhItemData.loc['zh'],
    nr: acnhItemData.loc['en-us'] || acnhItemData.loc['en'],
    i: [img], //todo
    t: ItemTypeMapV2[typeName],
    v: acnhItemData.vad ? versionMap[acnhItemData.vad] : Version.The100,
    c: [Color.White],
    cat: Catalog.ForSale,
    buy: acnhItemData.buy,
    sel: acnhItemData.sel,
    exc: acnhItemData.exp
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

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genItem(), 'acnh-items.json');
}
