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
} from "animal-crossing";
import type { Item as NewItem, Variant } from "../src/types/item";
import { ItemType, Version, ItemSize, Color } from "../src/types/item";
import type { Recipe as NewRecipe } from "../src/types/recipe";
import { RecipeType } from "../src/types/recipe";
import { CreatureType, type Creature as NewCreature } from "../src/types/creature";

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
function processImageUrlForStorage(imageUrl: string): string {
  if (!imageUrl) return "";
  const CDN_PREFIX = "https://acnhcdn.com/";
  if (imageUrl.startsWith(CDN_PREFIX)) {
    return imageUrl.substring(CDN_PREFIX.length);
  }
  return imageUrl;
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
  "Message Cards": ItemType.MessageCards,
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

let newRecipes: NewRecipe[] = [];
let newRecipeIdMap = new Map<number, NewRecipe>();
let newRecipeNameMap = new Map<string, NewRecipe>();
for (const oldRecipe of oldRecipes) {
  let images = [];
  images.push(processImageUrlForStorage(oldRecipe.image));
  if (oldRecipe.imageSh)
    images.push(processImageUrlForStorage(oldRecipe.imageSh));

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
    season: oldRecipe.seasonEvent ?? undefined,
    itemId: oldRecipe.craftedItemInternalId,
    color: oldRecipe.cardColor ?? undefined,
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
      image: processImageUrlForStorage(
        v.image || v.storageImage || v.closetImage || ""
      ),
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
    images.push(processImageUrlForStorage(oldItem.inventoryImage));
  if (oldItem.image) images.push(processImageUrlForStorage(oldItem.image));
  if (oldItem.storageImage)
    images.push(processImageUrlForStorage(oldItem.storageImage));
  if (oldItem.closetImage)
    images.push(processImageUrlForStorage(oldItem.closetImage));
  if (oldItem.framedImage)
    images.push(processImageUrlForStorage(oldItem.framedImage));
  if (oldItem.albumImage)
    images.push(processImageUrlForStorage(oldItem.albumImage));

  if (images.length === 0) {
    let variation = oldItem.variations?.[0];
    if (variation) {
      if (variation.image)
        images.push(processImageUrlForStorage(variation.image));
      if (variation.storageImage)
        images.push(processImageUrlForStorage(variation.storageImage));
      if (variation.closetImage)
        images.push(processImageUrlForStorage(variation.closetImage));
    }
  }
  if (oldItem.recipe) {
    images.push(processImageUrlForStorage(oldItem.recipe.image));
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
    size: oldItem.size ? sizeMap[oldItem.size] : undefined,
    tag: oldItem.tag,
    series: oldItem.series ?? undefined,
    themes:
      oldItem.themes && oldItem.themes.length > 0 ? oldItem.themes : undefined,
    set: oldItem.set ?? undefined,
    styles:
      oldItem.styles && oldItem.styles.length > 0 ? oldItem.styles : undefined,
    concepts,
    category,
    recipe: oldItem.recipe
      ? newRecipeIdMap.get(oldItem.recipe.internalId)?.id
      : undefined,
    buy: oldItem.buy ?? undefined,
    sell: oldItem.sell ?? undefined,
    variants: variants.length > 0 ? variants : undefined,
  };
}

let newItems: NewItem[] = [];
let newItemIdMap = new Map<number, NewItem>();
let newItemNameMap = new Map<string, NewItem>();
let messageCards = [];
for (const oldItem of oldItems) {
  if (oldItem.sourceSheet === OldItemSourceSheet.MessageCards) {
    oldItem.version = undefined; // 消息卡片不需要版本信息
    messageCards.push(oldItem);
  } else {
    const newItem = convertItem(oldItem);
    newItems.push(newItem);
    newItemIdMap.set(newItem.id, newItem);
    newItemNameMap.set(newItem.rawName, newItem);
  }
}

messageCards.sort((a, b) => a.internalId! - b.internalId!);

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
newItems.sort((a, b) => a.id - b.id);

let newCreatures: NewCreature[] = [];
for (const oldCreature of oldCreatures) {
  const newCreature: NewCreature = {
    id: oldCreature.internalId,
    order: oldCreature.num,
    type: creatureTypeMap[oldCreature.sourceSheet],
    name: oldCreature.translations?.cNzh || oldCreature.name,
    rawName: oldCreature.name,
    images: [
      processImageUrlForStorage(oldCreature.iconImage),
      processImageUrlForStorage(oldCreature.critterpediaImage),
      processImageUrlForStorage(oldCreature.furnitureImage),
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
  };
  newCreatures.push(newCreature);
}
newCreatures.sort((a, b) => a.id - b.id);

// 输出到文件
fs.writeFileSync(
  path.join(outputPath, "acnh-items.small.json"),
  JSON.stringify(newItems.map(removeNullFields)),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-message-cards.json"),
  JSON.stringify(messageCards.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-recipes.small.json"),
  JSON.stringify(newRecipes.map(removeNullFields), null, 2),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-creatures.small.json"),
  JSON.stringify(newCreatures.map(removeNullFields), null, 2),
  "utf-8"
);
