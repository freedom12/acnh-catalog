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
export async function loadCatalogData() {
    try {
        const response = await fetch(CONFIG.DATA_FILES.CATALOG);
        const data = await response.json();
        return new Set(data.items.map(item => item.label));
    } catch (error) {
        console.log('无法加载 catalog_items.json，将不显示拥有状态');
        return new Set();
    }
}

/**
 * 处理物品数据，添加分类和拥有状态
 */
export function processItemsData(acnhItems, ownedItemsSet) {
    // 定义服饰类分类
    // const clothingCategories = ['Accessories', 'Tops', 'Bottoms', 'Dress-Up', 'Headwear', 'Socks', 'Shoes', 'Bags', 'Umbrellas'];
    
    return acnhItems.map(item => {
        let name = item.translations?.cNzh || item.name;
        let id = item.internalId;
        let imageUrl = item.image || item.storageImage || item.closetImage || item.framedImage;
        // const isClothing = clothingCategories.includes(item.sourceSheet);
        
        // 处理变体信息
        let variations = [];
        if (item.variations && item.variations.length > 0) {
            variations = item.variations.map(v => ({
                name: v.variantTranslations?.cNzh || v.variation || '',
                imageUrl: v.image || v.storageImage || v.closetImage || v.framedImage || imageUrl,
                id: v.internalId || id
            }));
        }

        if (variations.length > 0)
        {
            // 如果有变体，使用第一个变体的信息作为默认
            // name = variations[0].name || name;
            id = variations[0].id || id;
            imageUrl = variations[0].imageUrl || imageUrl;
        }

        return {
            name: name,
            id: id,
            category: item.sourceSheet || 'Other',
            imageUrl: imageUrl,
            owned: ownedItemsSet.has(name),
            variations: variations,
            hasVariations: variations.length > 0,
            // 保留原始数据以备使用
            originalData: item
        };
    }).sort((a, b) => a.id - b.id);
}
