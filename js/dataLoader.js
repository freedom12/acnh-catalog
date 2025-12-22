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
    const clothingCategories = ['Accessories', 'Tops', 'Bottoms', 'Dress-Up', 'Headwear', 'Socks', 'Shoes', 'Bags', 'Umbrellas'];
    
    return acnhItems.map(item => {
        // 获取中文名称
        const chineseName = item.translations?.cNzh || item.name;
        let id = item.internalId;
        // 获取图片 URL
        let imageUrl = item.image || item.storageImage || item.closetImage || item.framedImage;
        const isClothing = clothingCategories.includes(item.sourceSheet);
        
        if (item.variations && item.variations.length > 0) {
            const variation = item.variations[0];
            imageUrl = variation.image || variation.storageImage || variation.closetImage || variation.framedImage || imageUrl;
            id = variation.internalId || id;
        }

        return {
            name: chineseName,
            id: [id],
            buy: item.buy || 0,
            sell: item.sell || 0,
            category: item.sourceSheet || 'Other',
            imageUrl: imageUrl,
            owned: ownedItemsSet.has(chineseName),
            // 保留原始数据以备使用
            originalData: item
        };
    });
}
