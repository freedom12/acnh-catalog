/**
 * 从 animal-crossing 包生成数据文件
 */
import * as fs from "fs";
import * as path from "path";
import {
  ItemSourceSheet as OldItemSourceSheet,
  type Item as OldItem,
} from "animal-crossing/lib/types/Item";
import {
  items as oldItems,
  recipes as oldRecipes,
  creatures as oldCreatures,
  villagers as oldVillagers,
  npcs as oldNpcs,
  reactions as oldReactions,
  construction as oldConstructions,
  seasonsAndEvents as oldSeasonsAndEvents,
} from "animal-crossing";
import type { Item as NewItem, Variant } from "../src/types/item";
import {
  ItemType,
  Version,
  ItemSize,
  Color,
  Currency,
} from "../src/types/item";
import type { Recipe as NewRecipe } from "../src/types/recipe";
import {
  Gender,
  Hobby,
  Personality,
  Species,
  type Villager as NewVillager,
} from "../src/types/villager";
import type { NPC as NewNPC } from "../src/types/npc";
import type { Reaction as NewReaction } from "../src/types/reaction";
import type { Artwork as NewArtwork } from "../src/types/artwork";
import type { Fossil as NewFossil } from "../src/types/fossil";
import {
  ConstructionType,
  type Construction as NewConstruction,
} from "../src/types/construction";
import { RecipeType } from "../src/types/recipe";
import {
  CreatureType,
  type Creature as NewCreature,
} from "../src/types/creature";
import type { MessageCard } from "../src/types/messagecard";
import { ActivityType, type Activity } from "../src/types/activity";

/**
 * 递归移除对象中的 null 和 undefined 字段
 */
function removeNullFields(obj: any): any {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeNullFields).filter((item) => item !== undefined);
  }
  const cleaned: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = removeNullFields(obj[key]);
      if (value !== undefined) {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  const CDN_PREFIX = "https://acnhcdn.com/";
  let url = imageUrl;
  if (url.startsWith(CDN_PREFIX)) {
    url = url.substring(CDN_PREFIX.length);
  }
  if (url.endsWith(".png")) {
    url = url.substring(0, url.length - 4);
  }
  return url;
}

const __dirname = path.join(process.cwd(), "tools");
const outputPath = path.join(__dirname, "..", "public", "config");

// 映射对象：字符串到数字枚举
const sourceSheetMap: Record<string, ItemType> = {
  Accessories: ItemType.Accessories,
  Artwork: ItemType.Artwork,
  Bags: ItemType.Bags,
  Bottoms: ItemType.Bottoms,
  "Ceiling Decor": ItemType.CeilingDecor,
  "Clothing Other": ItemType.ClothingOther,
  "Dress-Up": ItemType.DressUp,
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
  "Tools/Goods": ItemType.ToolsGoods,
  Tops: ItemType.Tops,
  Umbrellas: ItemType.Umbrellas,
  "Wall-mounted": ItemType.WallMounted,
  Wallpaper: ItemType.Wallpaper,
  Creature: ItemType.Creature,
};

const recipeCategoryMap: Record<string, RecipeType> = {
  Housewares: RecipeType.Housewares,
  Miscellaneous: RecipeType.Miscellaneous,
  "Wall-mounted": RecipeType.WallMounted,
  "Ceiling Decor": RecipeType.CeilingDecor,
  Equipment: RecipeType.Equipment,
  Other: RecipeType.Other,
  Floors: RecipeType.Floors,
  Rugs: RecipeType.Rugs,
  Wallpaper: RecipeType.Wallpaper,
  Tools: RecipeType.Tools,
  Sweet: RecipeType.Sweet,
  Savory: RecipeType.Savory,
};

const creatureTypeMap: Record<string, CreatureType> = {
  Insects: CreatureType.Insects,
  Fish: CreatureType.Fish,
  "Sea Creatures": CreatureType.SeaCreatures,
};

const versionAddedMap: Record<string, Version> = {
  "1.0.0": Version.The100,
  "1.1.0": Version.The110,
  "1.10.0": Version.The1100,
  "1.11.0": Version.The1110,
  "1.2.0": Version.The120,
  "1.3.0": Version.The130,
  "1.4.0": Version.The140,
  "1.5.0": Version.The150,
  "1.6.0": Version.The160,
  "1.7.0": Version.The170,
  "1.8.0": Version.The180,
  "1.9.0": Version.The190,
  "2.0.0": Version.The200,
  "2.0.4": Version.The204,
};

const sizeMap: Record<string, ItemSize> = {
  "0.5x1": ItemSize.The05X1,
  "1.5x1.5": ItemSize.The15X15,
  "1x0.5": ItemSize.The1X05,
  "1x1": ItemSize.The1X1,
  "1x1.5": ItemSize.The1X15,
  "1x2": ItemSize.The1X2,
  "2x0.5": ItemSize.The2X05,
  "2x1": ItemSize.The2X1,
  "2x1.5": ItemSize.The2X15,
  "2x2": ItemSize.The2X2,
  "3x1": ItemSize.The3X1,
  "3x2": ItemSize.The3X2,
  "3x3": ItemSize.The3X3,
  "4x3": ItemSize.The4X3,
  "4x4": ItemSize.The4X4,
  "5x5": ItemSize.The5X5,
};

const colorMap: Record<string, Color> = {
  Aqua: Color.Aqua,
  Beige: Color.Beige,
  Black: Color.Black,
  Blue: Color.Blue,
  Brown: Color.Brown,
  Colorful: Color.Colorful,
  Gray: Color.Gray,
  Green: Color.Green,
  Orange: Color.Orange,
  Pink: Color.Pink,
  Purple: Color.Purple,
  Red: Color.Red,
  White: Color.White,
  Yellow: Color.Yellow,
};

const currencyMap: Record<string, Currency> = {
  Bells: Currency.Bells,
  "Heart Crystals": Currency.HeartCrystals,
  "Nook Miles": Currency.NookMiles,
  "Nook Points": Currency.NookPoints,
  Poki: Currency.Poki,
};

let newRecipes: NewRecipe[] = [];
let newRecipeIdMap = new Map<number, NewRecipe>();
let newRecipeNameMap = new Map<string, NewRecipe>();
for (const oldRecipe of oldRecipes) {
  let images = [];
  images.push(processImageUrl(oldRecipe.image));
  if (oldRecipe.imageSh) images.push(processImageUrl(oldRecipe.imageSh));

  if (oldRecipe.seasonEvent && !oldRecipe.seasonEventExclusive) {
    oldRecipe.seasonEvent = null; // 非专属季节活动配方不记录季节活动,仅有树篱
  }
  const newRecipe: NewRecipe = {
    id: oldRecipe.internalId,
    type: recipeCategoryMap[oldRecipe.category],
    name: oldRecipe.translations.cNzh,
    rawName: oldRecipe.name,
    images: images,
    ver: versionAddedMap[oldRecipe.versionAdded],
    buy: oldRecipe.buy ?? undefined,
    sell: oldRecipe.sell ?? undefined,
    source: oldRecipe.source,
    sourceNotes: oldRecipe.sourceNotes ?? undefined,
    activity: oldRecipe.seasonEvent ?? undefined,
    itemId: oldRecipe.craftedItemInternalId,
    cardColor: oldRecipe.cardColor ?? undefined,
    materials: oldRecipe.materials,
  };
  newRecipes.push(newRecipe);
  newRecipeIdMap.set(newRecipe.id, newRecipe);
  newRecipeNameMap.set(newRecipe.rawName, newRecipe);
}
newRecipes.sort((a, b) => a.id - b.id);
/**
 * 处理变体数据
 */
function processVariations(oldItem: OldItem): Variant[] {
  if (!oldItem.variations || oldItem.variations.length === 0) {
    return [];
  }

  const variantMap = new Map<string, Variant>();

  oldItem.variations.forEach((v) => {
    const variantName = String(
      v.variantTranslations?.cNzh || v.variation || ""
    );

    if (!variantMap.has(variantName)) {
      variantMap.set(variantName, {
        name: variantName,
        patterns: [],
      });
    }

    const variant = variantMap.get(variantName)!;
    const patternColors = v.colors || oldItem.colors || [];
    variant.patterns.push({
      name: v.patternTranslations?.cNzh || v.pattern || "",
      image: processImageUrl(v.image || v.storageImage || v.closetImage || ""),
      id: v.internalId,
      colors: Array.from(
        new Set(
          patternColors.map((c) => colorMap[c]).filter((c) => c !== undefined)
        )
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
    new Set(
      (oldItem.colors || [])
        .map((c) => colorMap[c])
        .filter((c) => c !== undefined)
    )
  );

  // 如果有变体，使用第一个变体的第一个图案
  if (variants.length > 0) {
    const firstVariant = variants[0];
    if (firstVariant && firstVariant.patterns.length > 0) {
      const firstPattern = firstVariant.patterns[0];
      if (firstPattern) {
        id = firstPattern.id || id;
        colors = firstPattern.colors || colors;
      }
    }
  }

  return { id, colors };
}

/**
 * 从原始数据创建 Item
 * @param oldItem 原始物品数据
 * @returns Item 数据对象
 */
function convertItem(oldItem: OldItem): NewItem {
  const name = oldItem.translations?.cNzh || oldItem.name;
  const variants = processVariations(oldItem);
  const { id, colors } = getDefaultDisplayProperties(oldItem, variants);

  let images = [];
  if (oldItem.inventoryImage)
    images.push(processImageUrl(oldItem.inventoryImage));
  if (oldItem.image) images.push(processImageUrl(oldItem.image));
  if (oldItem.storageImage) images.push(processImageUrl(oldItem.storageImage));
  if (oldItem.closetImage) images.push(processImageUrl(oldItem.closetImage));
  if (oldItem.framedImage) images.push(processImageUrl(oldItem.framedImage));
  if (oldItem.albumImage) images.push(processImageUrl(oldItem.albumImage));

  if (images.length === 0) {
    let variation = oldItem.variations?.[0];
    if (variation) {
      if (variation.image) images.push(processImageUrl(variation.image));
      if (variation.storageImage)
        images.push(processImageUrl(variation.storageImage));
      if (variation.closetImage)
        images.push(processImageUrl(variation.closetImage));
    }
  }
  if (oldItem.recipe) {
    images.push(processImageUrl(oldItem.recipe.image));
  }

  let concepts =
    oldItem.concepts || oldItem.variations?.[0].concepts || undefined;
  concepts = concepts && concepts.length > 0 ? concepts : undefined;
  let category =
    oldItem.hhaCategory || oldItem.variations?.[0].hhaCategory || undefined;
  return {
    id,
    name,
    rawName: oldItem.name,
    type: sourceSheetMap[oldItem.sourceSheet],
    images,
    colors,
    ver: oldItem.versionAdded
      ? versionAddedMap[oldItem.versionAdded]
      : Version.The100,
    source: oldItem.source,
    sourceNotes: oldItem.sourceNotes || undefined,
    activity: oldItem.seasonEvent || undefined,
    size: oldItem.size ? sizeMap[oldItem.size] : undefined,
    tag: oldItem.tag,
    points: oldItem.hhaBasePoints ?? undefined,
    series: oldItem.series ?? undefined,
    themes:
      oldItem.themes && oldItem.themes.length > 0 ? oldItem.themes : undefined,
    set: oldItem.set ?? undefined,
    styles:
      oldItem.styles && oldItem.styles.length > 0
        ? Array.from(new Set(oldItem.styles))
        : undefined,
    concepts,
    category,
    recipe: oldItem.recipe
      ? newRecipeIdMap.get(oldItem.recipe.internalId)?.id
      : undefined,
    buy: oldItem.buy ?? undefined,
    sell: oldItem.sell ?? undefined,
    exch: oldItem.exchangePrice
      ? [oldItem.exchangePrice, currencyMap[oldItem.exchangeCurrency!]]
      : undefined,
    variants: variants.length > 0 ? variants : undefined,
    vTitle: oldItem.bodyTitle || undefined,
    pTitle: oldItem.variations?.[0].patternTitle || undefined,
  };
}

let newItems: NewItem[] = [];
let newItemIdMap = new Map<number, NewItem>();
let newItemNameMap = new Map<string, NewItem>();
let messageCards: MessageCard[] = [];
let fakeArtworks = new Map<string, OldItem>();
let realArtworks = new Map<string, OldItem>();
let fossilGroups = new Map<string, OldItem[]>();
for (const oldItem of oldItems) {
  if (oldItem.sourceSheet === OldItemSourceSheet.MessageCards) {
    const messageCard: MessageCard = {
      id: oldItem.internalId || 0,
      name: oldItem.translations?.cNzh || oldItem.name,
      rawName: oldItem.name,
      image: processImageUrl(oldItem.image || ""),
      ver: versionAddedMap[oldItem.version!] || Version.The200,
      buy: oldItem.buy ?? undefined,
      backColor: oldItem.backColor || undefined,
      bodyColor: oldItem.bodyColor!,
      headColor: oldItem.headColor!,
      footColor: oldItem.footColor!,
      penColors: [
        oldItem.penColor1!,
        oldItem.penColor2!,
        oldItem.penColor3!,
        oldItem.penColor4!,
      ],
      startDate: oldItem.startDate || undefined,
      endDate: oldItem.endDate || undefined,
      nhStartDate: oldItem.nhStartDate || undefined,
      nhEndDate: oldItem.nhEndDate || undefined,
      shStartDate: oldItem.shStartDate || undefined,
      shEndDate: oldItem.shEndDate || undefined,
    };
    messageCards.push(messageCard);
  } else {
    const newItem = convertItem(oldItem);
    newItems.push(newItem);
    newItemIdMap.set(newItem.id, newItem);
    newItemNameMap.set(newItem.rawName, newItem);

    if (oldItem.sourceSheet === OldItemSourceSheet.Artwork) {
      if (oldItem.genuine === true) {
        realArtworks.set(oldItem.name, oldItem);
      } else {
        fakeArtworks.set(oldItem.name, oldItem);
      }
    }

    if (oldItem.sourceSheet === OldItemSourceSheet.Fossils) {
      let groupName = oldItem.fossilGroup!;
      if (!fossilGroups.has(groupName)) {
        fossilGroups.set(groupName, []);
      }
      fossilGroups.get(groupName)!.push(oldItem);
    }
  }
}
messageCards.sort((a, b) => a.id - b.id);

let newArtworks: NewArtwork[] = [];
for (const [name, realArtwork] of realArtworks) {
  const fakeArtwork = fakeArtworks.get(name);
  const l = realArtwork.artist!.split(",");

  const newArtwork: NewArtwork = {
    id: realArtwork.internalId!,
    name: realArtwork.translations!.cNzh,
    rawName: realArtwork.name,
    image: processImageUrl(realArtwork.image!),
    texture: realArtwork.highResTexture
      ? processImageUrl(realArtwork.highResTexture)
      : undefined,
    ver: realArtwork.versionAdded
      ? versionAddedMap[realArtwork.versionAdded]
      : Version.The100,
    size: realArtwork.size ? sizeMap[realArtwork.size] : ItemSize.The1X1,
    colors: Array.from(
      new Set(
        (realArtwork.colors || [])
          .map((c) => colorMap[c])
          .filter((c) => c !== undefined)
      )
    ),
    title: realArtwork.realArtworkTitle!,
    artist: l[0]!.trim(),
    age: l[1]!.trim(),
    technique: l[2]!.trim(),
    desc: realArtwork.description![0]!,
    itemType: sourceSheetMap[realArtwork.category!],
    source: realArtwork.source!,
    buy: realArtwork.buy!,
    sell: realArtwork.sell!,
    fake: fakeArtwork
      ? {
          id: fakeArtwork.internalId || 0,
          image: processImageUrl(fakeArtwork.image!),
          texture: fakeArtwork.highResTexture
            ? processImageUrl(fakeArtwork.highResTexture)
            : undefined,
        }
      : undefined,
  };
  newArtworks.push(newArtwork);
}
newArtworks.sort((a, b) => a.id - b.id);

let newFossils: NewFossil[] = [];
for (const [groupName, parts] of fossilGroups) {
  //
  const fossil: NewFossil = {
    name: groupName,
    parts: parts
      .sort((a, b) => a.internalId! - b.internalId!)
      .map((part) => ({
        id: part.internalId!,
        name: part.name,
        image: processImageUrl(part.image!),
        sell: part.sell!,
      })),
    desc: parts[0].description![0]!,
  };
  newFossils.push(fossil);
}
newFossils.sort((a, b) => a.parts.length - b.parts.length);

const interiorStructures = JSON.parse(
  fs.readFileSync(path.join(__dirname, "Interior Structures.json"), "utf-8")
);
for (const structure of interiorStructures) {
  structure.colors = [structure.color1, structure.color2]; // 修正颜色字段
  if (structure.variations) {
    for (const variant of structure.variations) {
      variant.colors = [variant.color1, variant.color2]; // 修正变体颜色字段
    }
  }
  const newItem = convertItem(structure);
  newItem.type = ItemType.InteriorStructures;
  newItems.push(newItem);
  newItemIdMap.set(newItem.id, newItem);
  newItemNameMap.set(newItem.rawName, newItem);
}

let newCreatures: NewCreature[] = [];
for (const oldCreature of oldCreatures) {
  const newCreature: NewCreature = {
    id: oldCreature.internalId,
    order: oldCreature.num,
    type: creatureTypeMap[oldCreature.sourceSheet],
    name: oldCreature.translations?.cNzh || oldCreature.name,
    rawName: oldCreature.name,
    images: [
      processImageUrl(oldCreature.iconImage),
      processImageUrl(oldCreature.critterpediaImage),
      processImageUrl(oldCreature.furnitureImage),
    ],
    ver: oldCreature.versionAdded
      ? versionAddedMap[oldCreature.versionAdded]
      : Version.The100,
    colors: Array.from(new Set(oldCreature.colors.map((c) => colorMap[c]))),
    size: sizeMap[oldCreature.size],
    sell: oldCreature.sell,
    whereHow: oldCreature.whereHow ?? undefined,
    weather: oldCreature.weather ?? undefined,
    hemispheres: oldCreature.hemispheres,
    catchPhrase: oldCreature.catchPhrase![0]!,
    desc: oldCreature.description![0]!,
  };
  newCreatures.push(newCreature);

  const newItem: NewItem = {
    id: newCreature.id,
    name: newCreature.name,
    rawName: newCreature.rawName,
    images: newCreature.images,
    type: ItemType.Creature,
    ver: newCreature.ver,
    colors: newCreature.colors,
    size: newCreature.size,
    sell: newCreature.sell,
    points: oldCreature.hhaBasePoints,
    category: oldCreature.hhaCategory ?? undefined,
  };
  newItems.push(newItem);
  newItemIdMap.set(newItem.id, newItem);
  newItemNameMap.set(newItem.rawName, newItem);
}
newCreatures.sort((a, b) => {
  if (a.type !== b.type) {
    return a.type - b.type;
  }
  return a.order - b.order;
});
newItems.sort((a, b) => {
  if (a.type !== b.type) {
    return a.type - b.type;
  }
  return a.id - b.id;
});

const genderMap: Record<string, Gender> = {
  Male: Gender.Male,
  Female: Gender.Female,
};

const personalityMap: Record<string, Personality> = {
  Cranky: Personality.Cranky,
  Jock: Personality.Jock,
  Lazy: Personality.Lazy,
  Smug: Personality.Smug,
  Normal: Personality.Normal,
  Peppy: Personality.Peppy,
  Snooty: Personality.Snooty,
  "Big Sister": Personality.BigSister,
};

const hobbyMap: Record<string, Hobby> = {
  Education: Hobby.Education,
  Fashion: Hobby.Fashion,
  Fitness: Hobby.Fitness,
  Music: Hobby.Music,
  Nature: Hobby.Nature,
  Play: Hobby.Play,
};

const speciesMap: Record<string, Species> = {
  Alligator: Species.Alligator,
  Anteater: Species.Anteater,
  Bear: Species.Bear,
  "Bear cub": Species.BearCub,
  Bird: Species.Bird,
  Bull: Species.Bull,
  Cat: Species.Cat,
  Chicken: Species.Chicken,
  Cow: Species.Cow,
  Deer: Species.Deer,
  Dog: Species.Dog,
  Duck: Species.Duck,
  Eagle: Species.Eagle,
  Elephant: Species.Elephant,
  Frog: Species.Frog,
  Goat: Species.Goat,
  Gorilla: Species.Gorilla,
  Hamster: Species.Hamster,
  Hippo: Species.Hippo,
  Horse: Species.Horse,
  Kangaroo: Species.Kangaroo,
  Koala: Species.Koala,
  Lion: Species.Lion,
  Monkey: Species.Monkey,
  Mouse: Species.Mouse,
  Octopus: Species.Octopus,
  Ostrich: Species.Ostrich,
  Penguin: Species.Penguin,
  Pig: Species.Pig,
  Rabbit: Species.Rabbit,
  Rhinoceros: Species.Rhinoceros,
  Sheep: Species.Sheep,
  Squirrel: Species.Squirrel,
  Tiger: Species.Tiger,
  Wolf: Species.Wolf,
};

/**
 * 从字符串中提取3个数字，如果缺少后两个则用0填充
 * @param str 输入字符串，如 "3122,2_0" 或 "7142"
 * @returns 三个数字的数组
 */
function processFurnitureString(
  str: string | number
): [number, number, number] {
  const parts = String(str).split(",");
  const first = Number(parts[0]);
  if (parts.length > 1) {
    const secondParts = parts[1].split("_");
    return [first, Number(secondParts[0] || 0), Number(secondParts[1] || 0)];
  } else {
    return [first, 0, 0];
  }
}

let newVillagers: NewVillager[] = [];
for (const oldVillager of oldVillagers) {
  const newVillager: NewVillager = {
    id: oldVillager.filename,
    name: oldVillager.translations?.cNzh || oldVillager.name,
    rawName: oldVillager.name,
    images: [
      processImageUrl(oldVillager.iconImage),
      processImageUrl(oldVillager.photoImage),
    ].filter((url) => url !== ""),
    ver: versionAddedMap[oldVillager.versionAdded],
    species: speciesMap[oldVillager.species],
    gender: genderMap[oldVillager.gender],
    personality: personalityMap[oldVillager.personality],
    subtype: oldVillager.subtype,
    hobby: hobbyMap[oldVillager.hobby],
    birthday: oldVillager.birthday,
    styles: Array.from(new Set(oldVillager.styles)),
    colors: Array.from(new Set(oldVillager.colors.map((c) => colorMap[c]))),
    catchphrase: oldVillager.catchphrases.cNzh,
    saying: oldVillager.favoriteSaying,

    song: newItemNameMap.get(oldVillager.favoriteSong)?.id || 0,
    cloting: newItemNameMap.get(oldVillager.defaultClothing)?.id || 0,
    umbrella: newItemNameMap.get(oldVillager.defaultUmbrella)?.id || 0,
    wallpaper: newItemNameMap.get(oldVillager.wallpaper)?.id || 0,
    flooring: newItemNameMap.get(oldVillager.flooring)?.id || 0,
    furnitures: oldVillager.furnitureList,
    diyWorkbench: processFurnitureString(String(oldVillager.diyWorkbench)),
    kitchenware: processFurnitureString(String(oldVillager.kitchenEquipment)),
    houseImage: oldVillager.houseImage
      ? processImageUrl(oldVillager.houseImage)
      : undefined,
    bubbleColor: oldVillager.bubbleColor,
    nameColor: oldVillager.nameColor,
  };
  newVillagers.push(newVillager);
}
newVillagers.sort((a, b) => a.id.localeCompare(b.id));

let newNpcs: NewNPC[] = [];
for (const oldNpc of oldNpcs) {
  if (!oldNpc.iconImage) continue; // 跳过无效数据
  const newNpc: NewNPC = {
    id: oldNpc.npcId,
    order: oldNpc.internalId,
    name: oldNpc.translations?.cNzh || oldNpc.name,
    rawName: oldNpc.name,
    images: [
      processImageUrl(oldNpc.iconImage),
      processImageUrl(oldNpc.photoImage || ""),
    ].filter((url) => url !== ""),
    ver: oldNpc.versionAdded
      ? versionAddedMap[oldNpc.versionAdded]
      : Version.The100,
    gender: genderMap[oldNpc.gender],
    birthday: oldNpc.birthday,
    nameColor: oldNpc.nameColor!,
    bubbleColor: oldNpc.bubbleColor!,
  };
  newNpcs.push(newNpc);
}
newNpcs.sort((a, b) => a.order - b.order);

let newReactions: NewReaction[] = [];
for (const oldReaction of oldReactions) {
  const newReaction: NewReaction = {
    id: oldReaction.internalId,
    order: oldReaction.num,
    name: oldReaction.translations?.cNzh || oldReaction.name,
    rawName: oldReaction.name,
    image: processImageUrl(oldReaction.image),
    ver: versionAddedMap[oldReaction.versionAdded],
    source: oldReaction.source,
    sourceNotes: oldReaction.sourceNotes || undefined,
    activity: oldReaction.seasonEvent || undefined,
  };
  newReactions.push(newReaction);
}
newReactions.sort((a, b) => a.order - b.order);

const constructionTypeMap: Record<string, ConstructionType> = {
  Bridge: ConstructionType.Bridge,
  Door: ConstructionType.Door,
  Incline: ConstructionType.Incline,
  Mailbox: ConstructionType.Mailbox,
  Roofing: ConstructionType.Roofing,
  Siding: ConstructionType.Siding,
  Other: ConstructionType.Other,
};
let newConstructions: NewConstruction[] = [];
let id = 0;
for (const oldConstruction of oldConstructions) {
  id += 1;
  const newConstruction = {
    id: id,
    name: oldConstruction.translations?.cNzh || oldConstruction.name || "",
    rawName: oldConstruction.name || "",
    image: processImageUrl(oldConstruction.image),
    ver: versionAddedMap[oldConstruction.versionAdded] || Version.The200,
    buy: oldConstruction.buy || undefined,
    type: constructionTypeMap[oldConstruction.category || "Other"],
    source: oldConstruction.source || [],
  };
  newConstructions.push(newConstruction);
}
newConstructions.sort((a, b) => a.id - b.id);

const SeasonsAndEventsTypesMap: Record<string, ActivityType> = {
  "Basegame event": ActivityType.BasegameEvent,
  "Crafting season": ActivityType.CraftingSeason,
  "Nook Shopping event": ActivityType.NookShoppingEvent,
  "Shopping season": ActivityType.ShoppingSeason,
  "Special event": ActivityType.SpecialEvent,
  "Zodiac season": ActivityType.ZodiacSeason,
};

let activitys: Activity[] = [];
let activityId = 0;
for (const sae of oldSeasonsAndEvents) {
  activityId += 1;
  const activity: Activity = {
    id: activityId,
    name: sae.translations?.cNzh || sae.displayName,
    rawName: sae.name,
    ver: versionAddedMap[sae.versionAdded] || Version.The100,
    type: SeasonsAndEventsTypesMap[sae.type] || ActivityType.BasegameEvent,
  };
  if (sae.eventNotes) {
    console.log(`活动 ${activity.name}: ${sae.eventNotes}`);
  }
  activitys.push(activity);
  // console.log(
  //   `${activity.name}: ${sae.unlockDate} - ${sae.unlockMethod} - ${sae.year} - ${sae.datesNorthernHemisphere}`
  // );
}

// 输出到文件
fs.writeFileSync(
  path.join(outputPath, "acnh-items.json"),
  JSON.stringify(newItems.map(removeNullFields)),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-message-cards.json"),
  JSON.stringify(messageCards.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-artworks.json"),
  JSON.stringify(newArtworks.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-fossils.json"),
  JSON.stringify(newFossils.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-recipes.json"),
  JSON.stringify(newRecipes.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-creatures.json"),
  JSON.stringify(newCreatures.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-villagers.json"),
  JSON.stringify(newVillagers.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-npcs.json"),
  JSON.stringify(newNpcs.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-reactions.json"),
  JSON.stringify(newReactions.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-constructions.json"),
  JSON.stringify(newConstructions.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-activitys.json"),
  JSON.stringify(activitys.map(removeNullFields), null, 2),
  "utf-8"
);

for (const oldItem of oldItems) {
  if (oldItem.exchangeCurrency) {
    console.log(oldItem.translations?.cNzh || oldItem.name, oldItem.exchangeCurrency);
  }
}
