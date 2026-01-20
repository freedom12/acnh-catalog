import * as fs from 'fs';
import * as path from 'path';
import {
  Catalog,
  InteractType,
  KitType,
  LightType,
  SoundType,
  SpeakerType,
  VfxType,
  ItemType,
  Version,
  Currency,
  type Item,
  type Variant,
} from '../src/types/item';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util';
import { getAcnhItemData } from './acnh/index.js';
import { getSheetDatas, getTrans } from './excel/excel.js';

const __dirname = path.join(process.cwd(), 'tools');

//#region v1
const sheetNameMap: Record<string, ItemType> = {
  Housewares: ItemType.Housewares,
  Miscellaneous: ItemType.Miscellaneous,
  'Wall-mounted': ItemType.WallMounted,
  'Ceiling Decor': ItemType.CeilingDecor,
  'Interior Structures': ItemType.InteriorStructures,
  Wallpaper: ItemType.Wallpaper,
  Floors: ItemType.Floors,
  Rugs: ItemType.Rugs,
  Photos: ItemType.Photos,
  Posters: ItemType.Posters,
  ToolsGoods: ItemType.ToolsGoods,
  Fencing: ItemType.Fencing,
  Tops: ItemType.Tops,
  Bottoms: ItemType.Bottoms,
  'Dress-Up': ItemType.DressUp,
  Headwear: ItemType.Headwear,
  Accessories: ItemType.Accessories,
  Socks: ItemType.Socks,
  Shoes: ItemType.Shoes,
  Bags: ItemType.Bags,
  Umbrellas: ItemType.Umbrellas,
  'Clothing Other': ItemType.Wetsuits,
  Music: ItemType.Music,
  Insects: ItemType.Creatures,
  Fish: ItemType.Creatures,
  'Sea Creatures': ItemType.Creatures,
  Fossils: ItemType.Fossils,
  Artwork: ItemType.Artwork,
  Gyroids: ItemType.Gyroids,
  Other: ItemType.Other,
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
  'Hotel Tickets': Currency.HotelTickets,
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

function convertFurnitureItemFromSheetData(
  sheetDatas: any,
  reciepeSheetDataMap: Map<number, any>
): Item {
  const sheetData = sheetDatas[0];
  const itemType = sheetNameMap[sheetData.sheetName];
  const id = Number(sheetData['Internal ID']);
  const name = getTrans('Items', id);
  if (!name) {
    console.warn(`物品翻译未找到: ${id}`);
  }
  const images = [processImageUrl(sheetData['Image'])];
  let icon: string | undefined = undefined;
  if (sheetData['Icon Image'] && sheetData['Icon Image'] !== 'NA') {
    icon = processImageUrl(sheetData['Icon Image']);
  }

  const colors = Array.from(
    new Set([sheetData['Color 1'], sheetData['Color 2']].filter(Boolean))
  ).map((c) => colorMap[c]);
  let acnhItemData = getAcnhItemData(id);
  let activitys = acnhItemData?.evt;
  if (typeof activitys === 'string') {
    activitys = [activitys];
  }

  let variants: Variant[] = [];
  let vNames: string[] = [];
  let pNames: string[] = [];
  for (const sd of sheetDatas) {
    if (!sd['Variant ID'] || sd['Variant ID'] === 'NA') {
      continue;
    }
    const l: [number, number] = sd['Variant ID'].split('_').map((s: string) => Number(s));
    const [vIndex, pIndex] = l;
    if (!variants[vIndex]) {
      variants[vIndex] = [];
    }
    variants[vIndex][pIndex] = {
      c: Array.from(new Set([sd['Color 1'], sd['Color 2']].filter(Boolean))).map(
        (c) => colorMap[c]
      ),
    };
    if (sd['Variation'] && sd['Variation'] !== 'NA') {
      let vName = getTrans('Item Variant Names', `${id}_${vIndex}`);
      if (!vName) {
        // console.warn(`物品变体名称翻译未找到: ${id}_${vIndex}`);
        vName = sd['Variation'] as string;
      }
      vNames[vIndex] = vName;
    }
    if (sd['Pattern'] && sd['Pattern'] !== 'NA') {
      let pName = getTrans('Item Pattern Names', `${id}_${pIndex}`);
      if (!pName) {
        // console.warn(`物品图案名称翻译未找到: ${id}_${pIndex}`);
        pName = sd['Pattern'] as string;
      }
      pNames[pIndex] = pName;
    }
  }

  let vTitle: string | undefined = undefined;
  if (sheetData['Body Title'] && sheetData['Body Title'] !== 'NA') {
    vTitle = getTrans('Item Variant Types', id) || undefined;
    if (!vTitle) {
      // console.warn(`物品变体标题翻译未找到: ${id}`);
      vTitle = sheetData['Body Title'];
    }
  }
  let pTitle: string | undefined = undefined;
  if (sheetData['Pattern Title'] && sheetData['Pattern Title'] !== 'NA') {
    pTitle = getTrans('Item Pattern Types', id) || undefined;
    if (!pTitle) {
      // console.warn(`物品图案标题翻译未找到: ${id}`);
      pTitle = sheetData['Pattern Title'];
    }
  }

  let recipeId: number | undefined = undefined;
  if (reciepeSheetDataMap.has(id)) {
    const recipeSheetData = reciepeSheetDataMap.get(id);
    recipeId = recipeSheetData['Internal ID'];
    images.push(processImageUrl(recipeSheetData['Image']));
  }

  let concept = [sheetData['HHA Concept 1'], sheetData['HHA Concept 2']].filter(
    (s) => s && !!s && s !== 'None'
  );

  let vfxType: VfxType | undefined = undefined;
  if (sheetData['VFX'] && sheetData['VFX'] === 'Yes') {
    if (sheetData['VFX Type'] && sheetData['VFX Type'] !== 'NA') {
      vfxType = vfxTypeMap[sheetData['VFX Type']];
    } else {
      vfxType = VfxType.Normal;
    }
  }

  let useTimes: number | undefined = undefined;
  if (sheetData['Uses'] && sheetData['Uses'] !== 'NA') {
    if (sheetData['Uses'] === 'Infinite') {
      useTimes = -1;
    } else {
      useTimes = Number(sheetData['Uses']);
    }
  }

  let interactType: InteractType | undefined = undefined;
  if (sheetData['Interact Type'] && sheetData['Interact Type'] !== 'No') {
    if (sheetData['Interact Type'] === 'Yes') {
      interactType = InteractType.Normal;
    } else {
      interactType = interactTypeMap[sheetData['Interact Type']];
    }
  }

  let speakerType: SpeakerType | undefined = undefined;
  if (sheetData['Speaker Type'] && sheetData['Speaker Type'] !== 'Does not play music') {
    speakerType = speakerTypeMap[sheetData['Speaker Type']];
  }

  let lightType: LightType | undefined = undefined;
  if (sheetData['Lighting Type'] && sheetData['Lighting Type'] !== 'No lighting') {
    lightType = lightTypeMap[sheetData['Lighting Type']];
  }

  let soundType: SoundType | undefined = undefined;
  if (sheetData['Sound Type']) {
    soundType = soundTypeMap[sheetData['Sound Type']];
  }

  const item: Item = {
    id: id,
    n: name || sheetData['Name'],
    nr: sheetData['Name'],
    t: itemType,

    i: images,
    icon: icon,
    c: colors,
    v: sheetData['Version Added']
      ? versionMap[sheetData['Version Added']]
      : Version.The100,
    cat: sheetData['Catalog'] ? catalogMap[sheetData['Catalog']] : Catalog.NotInCatalog,
    srcs: sheetData['Source']
      ? sheetData['Source'].split(';').map((s: string) => s.trim())
      : undefined,
    srcN: sheetData['Source Notes']
      ? sheetData['Source Notes'].split(';').map((s: string) => s.trim())
      : undefined,
    acts: activitys,
    s: sheetData['Size'] ? sizeMap[sheetData['Size']] : undefined,
    diy: recipeId,
    buy: sheetData['Buy'] && sheetData['Buy'] !== 'NFS' ? sheetData['Buy'] : undefined,
    sel: sheetData['Sell'] && sheetData['Sell'] !== 'NA' ? sheetData['Sell'] : undefined,
    exc:
      sheetData['Exchange Price'] && sheetData['Exchange Price'] !== 'NA'
        ? [sheetData['Exchange Price'], currencyMap[sheetData['Exchange Currency']!]]
        : undefined,

    tag: sheetData['Tag'] || undefined,
    hpt: sheetData['HHA Base Points'] || undefined,
    hser:
      sheetData['HHA Series'] && sheetData['HHA Series'] !== 'None'
        ? sheetData['HHA Series']
        : undefined,
    hset:
      sheetData['HHA Set'] && sheetData['HHA Set'] !== 'None'
        ? sheetData['HHA Set']
        : undefined,
    hcpt: concept.length > 0 ? concept : undefined,
    hcat:
      sheetData['HHA Category'] && sheetData['HHA Category'] !== 'None'
        ? sheetData['HHA Category']
        : undefined,

    vs: variants.length > 1 ? variants : undefined,
    vt: vTitle,
    pt: pTitle,
    vn: vNames.length > 0 ? vNames : undefined,
    pn: pNames.length > 0 ? pNames : undefined,
    iv:
      sheetData['Body Customize'] === 'Yes' || sheetData['Cyrus Customize Price'] !== 'NA'
        ? [
            sheetData['Body Customize'] === 'Yes' ? 1 : 0,
            sheetData['Cyrus Customize Price'] !== 'NA'
              ? Number(sheetData['Cyrus Customize Price'])
              : 0,
            acnhItemData?.nvc,
          ]
        : undefined,
    ip:
      sheetData['Pattern Customize'] === 'Yes'
        ? [
            sheetData['Pattern Customize'] === 'Yes' ? 1 : 0,
            acnhItemData?.spt ? 1 : 0,
            acnhItemData?.cpt ? 1 : 0,
          ]
        : undefined,
    cus:
      sheetData['Kit Cost'] !== 'NA'
        ? [sheetData['Kit Cost'], kitTypeMap[sheetData['Kit Type']] || KitType.Normal]
        : undefined,

    fd:
      sheetData['Food Power'] && sheetData['Food Power'] !== 'NA'
        ? Number(sheetData['Food Power'])
        : undefined,
    ss:
      sheetData['Stack Size'] && sheetData['Stack Size'] !== 'NA'
        ? Number(sheetData['Stack Size'])
        : undefined,
    us: useTimes,

    iod: sheetData['Outdoor'] && sheetData['Outdoor'] === 'Yes' ? true : undefined,
    isf: sheetData['Surface'] && sheetData['Surface'] === 'Yes' ? true : undefined,
    idd: sheetData['Door Deco'] && sheetData['Door Deco'] === 'Yes' ? true : undefined,

    it: interactType,
    st: speakerType,
    lt: lightType,
    sdt: soundType,
    vfxt: vfxType,
  };
  return item;
}

function convertClothingItemFromSheetData(
  sheetDatas: any,
  reciepeSheetDataMap: Map<number, any>
): Item {
  const sheetData = sheetDatas[0];
  const itemType = sheetNameMap[sheetData.sheetName];
  const id = Number(sheetData['Internal ID']);
  const groupId = Number(sheetData['ClothGroup ID']);
  let name: string | null = null;
  if (!isNaN(groupId)) {
    name = getTrans('Clothing', groupId);
  } else {
    name = getTrans('Items', id);
  }
  if (!name) {
    console.warn(`物品翻译未找到: ${id}`);
  }

  const images = [processImageUrl(sheetData['Storage Image'])];
  if (sheetData['Closet Image'] && sheetData['Closet Image'] !== 'NA') {
    images.push(processImageUrl(sheetData['Closet Image']));
  }
  const colors = Array.from(
    new Set([sheetData['Color 1'], sheetData['Color 2']].filter(Boolean))
  ).map((c) => colorMap[c]);
  let acnhItemData = getAcnhItemData(id);
  let activitys = acnhItemData?.evt;
  if (typeof activitys === 'string') {
    activitys = [activitys];
  }

  let variants: Variant[] = [];
  let vNames: string[] = [];
  for (const sd of sheetDatas) {
    if (!sd['Sort Order'] || sd['Sort Order'] === 'NA') {
      continue;
    }
    const vIndex = Number(sd['Sort Order']);
    const pIndex = 0;
    if (!variants[vIndex]) {
      variants[vIndex] = [];
    }
    const subId = Number(sd['Internal ID']);
    const sunImages = [processImageUrl(sd['Storage Image'])];
    if (sd['Closet Image'] && sd['Closet Image'] !== 'NA') {
      sunImages.push(processImageUrl(sd['Closet Image']));
    }
    variants[vIndex][pIndex] = {
      id: subId,
      i: sunImages,
      c: Array.from(new Set([sd['Color 1'], sd['Color 2']].filter(Boolean))).map(
        (c) => colorMap[c]
      ),
    };
    if (sd['Variation'] && sd['Variation'] !== 'NA') {
      let vName = getTrans('Clothing Variant', `${groupId}_${subId}`);
      if (!vName) {
        console.warn(`服饰变体名称翻译未找到: ${groupId}_${subId}`);
        vName = sd['Variation'] as string;
      }
      vNames[vIndex] = vName;
    }
  }

  let recipeId: number | undefined = undefined;
  if (reciepeSheetDataMap.has(id)) {
    const recipeSheetData = reciepeSheetDataMap.get(id);
    recipeId = recipeSheetData['Internal ID'];
    images.push(processImageUrl(recipeSheetData['Image']));
  }

  let styles = [sheetData['Style 1'], sheetData['Style 2']].filter(
    (s) => s && !!s && s !== 'None'
  );
  styles = Array.from(new Set(styles));

  let item: Item = {
    id: id,
    n: name || sheetData['Name'],
    nr: sheetData['Name'],
    t: itemType,

    i: images,
    c: colors,
    v: sheetData['Version Added']
      ? versionMap[sheetData['Version Added']]
      : Version.The100,
    cat: sheetData['Catalog'] ? catalogMap[sheetData['Catalog']] : Catalog.NotInCatalog,
    srcs: sheetData['Source']
      ? sheetData['Source'].split(';').map((s: string) => s.trim())
      : undefined,
    srcN: sheetData['Source Notes']
      ? sheetData['Source Notes'].split(';').map((s: string) => s.trim())
      : undefined,
    acts: activitys,
    s: sheetData['Size'] ? sizeMap[sheetData['Size']] : undefined,
    diy: recipeId,
    buy: sheetData['Buy'] && sheetData['Buy'] !== 'NFS' ? sheetData['Buy'] : undefined,
    sel: sheetData['Sell'] && sheetData['Sell'] !== 'NA' ? sheetData['Sell'] : undefined,
    exc:
      sheetData['Exchange Price'] && sheetData['Exchange Price'] !== 'NA'
        ? [sheetData['Exchange Price'], currencyMap[sheetData['Exchange Currency']!]]
        : undefined,

    hpt: sheetData['HHA Base Points'] || undefined,

    vs: variants.length > 1 ? variants : undefined,
    vn: vNames.length > 0 ? vNames : undefined,

    thms: sheetData['Label Themes']
      ? sheetData['Label Themes'].split(';').map((s: string) => s.trim())
      : undefined,
    stls: styles.length > 0 ? styles : undefined,
  };
  return item;
}

export function genItem(): Item[] {
  const sheetDatas = getSheetDatas();

  const reciepeSheetDataMap = new Map<number, any>();
  for (const sheetData of sheetDatas['Recipes']) {
    const resultId = Number(sheetData['Crafted Item Internal ID']);
    reciepeSheetDataMap.set(resultId, sheetData);
  }

  let furnitureMap = new Map<number, any[]>();
  let clothingMap = new Map<number, any[]>();
  for (const [sheetName, _] of Object.entries(sheetNameMap)) {
    for (const sheetData of sheetDatas[sheetName]) {
      if (sheetName === 'Music') {
        sheetData['Image'] = sheetData['Framed Image'];
      }
      if (sheetName === 'Other') {
        if (sheetData['Storage Image'] && sheetData['Storage Image'] !== 'NA') {
          sheetData['Image'] = sheetData['Storage Image'];
        } else {
          sheetData['Image'] = sheetData['Inventory Image'];
        }
        sheetData['Icon Image'] = sheetData['Inventory Image'];
      }
      if (
        sheetName === 'Insects' ||
        sheetName === 'Fish' ||
        sheetName === 'Sea Creatures'
      ) {
        sheetData['Image'] = sheetData['Furniture Image'];
        sheetData['Tag'] = sheetName;
      }
      if (
        sheetName === 'Housewares' ||
        sheetName === 'Miscellaneous' ||
        sheetName === 'Wall-mounted' ||
        sheetName === 'Ceiling Decor' ||
        sheetName === 'Interior Structures' ||
        sheetName === 'Wallpaper' ||
        sheetName === 'Floors' ||
        sheetName === 'Rugs' ||
        sheetName === 'Photos' ||
        sheetName === 'Posters' ||
        sheetName === 'ToolsGoods' ||
        sheetName === 'Fencing' ||
        sheetName === 'Insects' ||
        sheetName === 'Fish' ||
        sheetName === 'Sea Creatures' ||
        sheetName === 'Fossils' ||
        sheetName === 'Artwork' ||
        sheetName === 'Music' ||
        sheetName === 'Gyroids' ||
        sheetName === 'Other'
      ) {
        let id = Number(sheetData['Internal ID']);
        sheetData.sheetName = sheetName;
        if (!furnitureMap.get(id)) {
          furnitureMap.set(id, []);
        }
        furnitureMap.get(id)!.push(sheetData);
      } else if (
        sheetName === 'Tops' ||
        sheetName === 'Bottoms' ||
        sheetName === 'Dress-Up' ||
        sheetName === 'Headwear' ||
        sheetName === 'Accessories' ||
        sheetName === 'Socks' ||
        sheetName === 'Shoes' ||
        sheetName === 'Bags' ||
        sheetName === 'Umbrellas' ||
        sheetName === 'Clothing Other'
      ) {
        let id = Number(sheetData['ClothGroup ID']);
        if (isNaN(id)) {
          id = Number(sheetData['Internal ID']);
        } else {
          id = id * 1000000;
        }
        sheetData.sheetName = sheetName;
        if (!clothingMap.get(id)) {
          clothingMap.set(id, []);
        }
        clothingMap.get(id)!.push(sheetData);
      }
    }
  }
  let items: Item[] = [];
  for (const [_, sheetDatas] of furnitureMap.entries()) {
    const item = convertFurnitureItemFromSheetData(sheetDatas, reciepeSheetDataMap);
    items.push(item);
  }
  for (const [_, sheetDatas] of clothingMap.entries()) {
    const item = convertClothingItemFromSheetData(sheetDatas, reciepeSheetDataMap);
    items.push(item);
  }
  items = sortItems(items);
  return items;
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

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genItem(), 'acnh-items.json');
}
