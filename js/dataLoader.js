/**
 * 数据加载模块
 */

import { CONFIG } from './config.js';

/**
 * 加载物品数据
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
 * 合并所有分类的物品数据
 */
export function mergeItemsData(data, ownedItemsSet) {
    const allItems = [];
    
    for (const category in data) {
        data[category].forEach(item => {
            allItems.push({
                ...item,
                category: category,
                owned: ownedItemsSet.has(item.name)
            });
        });
    }
    
    return allItems;
}
