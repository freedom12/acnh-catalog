/**
 * 从 animal-crossing 包生成数据文件
 */

import { items as oldItems } from "animal-crossing";
import type {
  Item as NewItem,
  RecipeData,
  VariantGroup,
} from "../src/types/item";
import { ItemCategory, Version, ItemSize, Color } from "../src/types/item";
import * as fs from "fs";
import * as path from "path";
import {
  ItemSourceSheet as OldItemSourceSheet,
  type Item as OldItem,
} from "animal-crossing/lib/types/Item";

/**
 * 处理图片 URL，去掉 CDN 前缀以节省存储空间
 */
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
const sourceSheetMap: Record<string, ItemCategory> = {
  Accessories: ItemCategory.Accessories,
  Artwork: ItemCategory.Artwork,
  Bags: ItemCategory.Bags,
  Bottoms: ItemCategory.Bottoms,
  "Ceiling Decor": ItemCategory.CeilingDecor,
  "Clothing Other": ItemCategory.ClothingOther,
  "Dress-Up": ItemCategory.DressUp,
  Fencing: ItemCategory.Fencing,
  Floors: ItemCategory.Floors,
  Fossils: ItemCategory.Fossils,
  Gyroids: ItemCategory.Gyroids,
  Headwear: ItemCategory.Headwear,
  Housewares: ItemCategory.Housewares,
  "Message Cards": ItemCategory.MessageCards,
  Miscellaneous: ItemCategory.Miscellaneous,
  Music: ItemCategory.Music,
  Other: ItemCategory.Other,
  Photos: ItemCategory.Photos,
  Posters: ItemCategory.Posters,
  Rugs: ItemCategory.Rugs,
  Shoes: ItemCategory.Shoes,
  Socks: ItemCategory.Socks,
  "Tools/Goods": ItemCategory.ToolsGoods,
  Tops: ItemCategory.Tops,
  Umbrellas: ItemCategory.Umbrellas,
  "Wall-mounted": ItemCategory.WallMounted,
  Wallpaper: ItemCategory.Wallpaper,
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

let newItems: NewItem[] = [];

/**
 * 处理配方数据，将材料名称转换为中文
 */
function processRecipeData(recipeData: any): RecipeData | undefined {
  if (!recipeData) return undefined;

  // 转换材料名称为中文
  let materials: Record<string, number> | undefined;
  if (recipeData.materials && recipeData.materialsTranslations) {
    materials = {};
    for (const [materialKey, quantity] of Object.entries(
      recipeData.materials
    )) {
      // 尝试获取中文翻译，如果没有则使用原始名称
      const translation = recipeData.materialsTranslations[materialKey];
      const materialName = translation?.cNzh || materialKey;
      materials[materialName] = quantity as number;
    }
  } else if (recipeData.materials) {
    materials = recipeData.materials;
  }

  return {
    name: recipeData.name || "",
    image: recipeData.image,
    materials,
    source: recipeData.source,
    sourceNotes: recipeData.sourceNotes,
    seasonEvent: recipeData.seasonEvent,
    ver: recipeData.versionAdded
      ? versionAddedMap[recipeData.versionAdded]
      : undefined,
    category: recipeData.category,
    buy: recipeData.buy,
    sell: recipeData.sell,
  };
}

/**
 * 处理变体数据
 */
function processVariations(oldItem: OldItem): VariantGroup[] {
  if (!oldItem.variations || oldItem.variations.length === 0) {
    return [];
  }

  const variantMap = new Map<string, VariantGroup>();

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
      colors: Array.from(new Set(patternColors.map((c) => colorMap[c]))),
    });
  });

  return Array.from(variantMap.values());
}

function getDefaultDisplayProperties(
  oldItem: OldItem,
  variants: VariantGroup[]
): { id: number; colors: Color[] } {
  let id = oldItem.internalId ?? 0;
  let colors = Array.from(
    new Set((oldItem.colors || []).map((c) => colorMap[c]))
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

  // 处理变体
  const variants = processVariations(oldItem);

  // 获取默认显示属性
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
  const result: NewItem = {
    name,
    rawName: oldItem.name,
    id,
    category: sourceSheetMap[oldItem.sourceSheet],
    images,
    colors,
    ver: oldItem.versionAdded
      ? versionAddedMap[oldItem.versionAdded]
      : undefined,
    source: oldItem.source,
    size: oldItem.size ? sizeMap[oldItem.size] : undefined,
    tag: oldItem.tag,
    series: oldItem.series ?? undefined,
    recipe: oldItem.recipe ? processRecipeData(oldItem.recipe) : undefined,
    buy: oldItem.buy ?? undefined,
    sell: oldItem.sell ?? undefined,
  };

  // 只有当 variants 不为空时才添加该字段
  if (variants.length > 0) {
    result.variants = variants;
  }

  return result;
}

let messageCards = [];
// 遍历 animal-crossing 包中的 oldItems 数据，转换为newItems 结构
for (const oldItem of oldItems) {
  if (oldItem.sourceSheet === OldItemSourceSheet.MessageCards) {
    oldItem.version = undefined; // 消息卡片不需要版本信息
    messageCards.push(oldItem);
  } else {
    const newItem = convertItem(oldItem);
    newItems.push(newItem);
  }
}

messageCards.sort((a, b) => a.internalId! - b.internalId!);

// 输出到文件
fs.writeFileSync(
  path.join(outputPath, "acnh-items.small.json"),
  JSON.stringify(newItems),
  "utf-8"
);

fs.writeFileSync(
  path.join(outputPath, "acnh-message-cards.json"),
  JSON.stringify(messageCards, null, 2),
  "utf-8"
);
