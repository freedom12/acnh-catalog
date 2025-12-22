/**
 * 数据加载模块
 */

import { CONFIG } from "./config.js";

/**
 * 加载物品数据（从 acnh-items.json）
 */
export async function loadItemsData() {
  const response = await fetch(CONFIG.DATA_FILES.ITEMS);
  return await response.json();
}

/**
 * 加载已拥有物品数据
 */
export async function loadCatalogData() {
  try {
    const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    const data = await response.json();
    return new Set(data.items.map((item) => item.label));
  } catch (error) {
    console.log("无法加载 catalog_items.json，将不显示拥有状态");
    return new Set();
  }
}

/**
 * 处理物品数据，添加分类和拥有状态
 */
export function processItemsData(acnhItems, ownedItemsSet) {
  return acnhItems
    .map((item) => {
      let name = item.translations?.cNzh || item.name;
      let id = item.internalId;
      let imageUrl =
        item.image ||
        item.storageImage ||
        item.closetImage ||
        item.framedImage ||
        item.inventoryImage;

      // 处理两层变体信息：variant(款式) 和 pattern(图案)
      let variantGroups = [];
      let hasVariations = false;

      if (item.variations && item.variations.length > 0) {
        // 按 variant 分组
        const variantMap = new Map();

        item.variations.forEach((v) => {
          const variantName = v.variantTranslations?.cNzh || v.variation || "";

          if (!variantMap.has(variantName)) {
            variantMap.set(variantName, {
              variantName: variantName,
              patterns: [],
            });
          }

          variantMap.get(variantName).patterns.push({
            patternName: v.patternTranslations?.cNzh || v.pattern || "",
            imageUrl:
              v.image ||
              v.storageImage ||
              v.closetImage ||
              v.framedImage ||
              item.inventoryImage ||
              imageUrl,
            id: v.internalId || id,
            uniqueEntryId: v.uniqueEntryId,
          });
        });

        variantGroups = Array.from(variantMap.values());
        hasVariations = variantGroups.length > 0;

        // 使用第一个变体的第一个图案作为默认
        if (hasVariations && variantGroups[0].patterns.length > 0) {
          const firstPattern = variantGroups[0].patterns[0];
          id = firstPattern.id || id;
          imageUrl = firstPattern.imageUrl || imageUrl;
        }
      }

      return {
        name: name,
        id: id,
        category: item.sourceSheet || "Other",
        imageUrl: imageUrl,
        owned: ownedItemsSet.has(name),
        variantGroups: variantGroups,
        hasVariations: hasVariations,
        // 保留原始数据以备使用
        originalData: item,
      };
    })
    .sort((a, b) => a.id - b.id);
}
