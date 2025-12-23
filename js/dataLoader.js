/**
 * 数据加载模块
 */

import { CONFIG } from './config.js';

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
export async function loadCatalogData(data) {
  try {
    // const response = await fetch(CONFIG.DATA_FILES.CATALOG);
    // const data = await response.json();
    const ownedNames = new Set();
    const ownedIds = new Set();

    if (data) {
      data.items.forEach((item) => {
        // 添加物品名称（主要用于判断拥有状态）
        ownedNames.add(item.label);
        // 添加物品的 unique_id
        ownedIds.add(item.unique_id);
      });
    }

    return { ownedNames, ownedIds };
  } catch (error) {
    // console.log('无法加载 catalog_items.json，将不显示拥有状态');
    return { ownedNames: new Set(), ownedIds: new Set() };
  }
}

/**
 * 处理物品数据，添加分类和拥有状态
 */
export function processItemsData(acnhItems, ownedData) {
  const { ownedNames, ownedIds } = ownedData;

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
      let colors = item.colors || [];
      let owned = false;

      if (item.variations && item.variations.length > 0) {
        // 按 variant 分组
        const variantMap = new Map();

        item.variations.forEach((v) => {
          const variantName = v.variantTranslations?.cNzh || v.variation || '';

          if (!variantMap.has(variantName)) {
            variantMap.set(variantName, {
              variantName: variantName,
              patterns: [],
            });
          }

          variantMap.get(variantName).patterns.push({
            patternName: v.patternTranslations?.cNzh || v.pattern || '',
            imageUrl:
              v.image ||
              v.storageImage ||
              v.closetImage ||
              v.framedImage ||
              item.inventoryImage ||
              imageUrl,
            id: v.internalId || id,
            uniqueEntryId: v.uniqueEntryId,
            colors: v.colors || item.colors || [],
          });
        });

        variantGroups = Array.from(variantMap.values());
        hasVariations = variantGroups.length > 0;

        // 使用第一个变体的第一个图案作为默认
        if (hasVariations && variantGroups[0].patterns.length > 0) {
          const firstPattern = variantGroups[0].patterns[0];
          id = firstPattern.id || id;
          imageUrl = firstPattern.imageUrl || imageUrl;
          colors = firstPattern.colors || colors;
        }
      }

      // 检查是否拥有（通过名称或ID）
      owned =
        ownedNames.has(name) ||
        ownedIds.has(item.internalId) ||
        ownedIds.has(item.uniqueEntryId);

      return {
        name: name,
        id: id,
        category: item.sourceSheet || 'Other',
        imageUrl: imageUrl,
        colors: colors,
        owned: owned,
        variantGroups: variantGroups,
        hasVariations: hasVariations,
        vIndex: 0, // 默认显示第一个变体
        pIndex: 0, // 默认显示第一个图案
        // 提升筛选所需字段到顶层
        versionAdded: item.versionAdded,
        source: item.source,
        size: item.size,
        tag: item.tag,
        series: item.series,
        seriesName: item.seriesTranslations?.cNzh || item.series,
        // 保留原始数据以备使用
        originalData: item,
      };
    })
    .sort((a, b) => a.id - b.id);
}
