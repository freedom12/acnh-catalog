/**
 * 筛选和排序模块
 */

import { CONFIG } from './config.js';

/**
 * 筛选物品
 */
export function filterItems(allItems, searchTerm, category, ownedFilter) {
    return allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !category || item.category === category;
        const matchesOwned = ownedFilter === CONFIG.FILTER_OPTIONS.ALL || 
                            (ownedFilter === CONFIG.FILTER_OPTIONS.OWNED && item.owned) ||
                            (ownedFilter === CONFIG.FILTER_OPTIONS.NOT_OWNED && !item.owned);
        return matchesSearch && matchesCategory && matchesOwned;
    });
}

/**
 * 排序物品
 */
export function sortItems(items, sortValue) {
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
        switch (sortValue) {
            case CONFIG.SORT_OPTIONS.NAME_ASC:
                return a.name.localeCompare(b.name, 'zh-CN');
            case CONFIG.SORT_OPTIONS.NAME_DESC:
                return b.name.localeCompare(a.name, 'zh-CN');
            case CONFIG.SORT_OPTIONS.PRICE_ASC:
                return (a.price || 0) - (b.price || 0);
            case CONFIG.SORT_OPTIONS.PRICE_DESC:
                return (b.price || 0) - (a.price || 0);
            case CONFIG.SORT_OPTIONS.ID_ASC:
                return (a.id[0] || 0) - (b.id[0] || 0);
            case CONFIG.SORT_OPTIONS.ID_DESC:
                return (b.id[0] || 0) - (a.id[0] || 0);
            default:
                return 0;
        }
    });
    
    return sortedItems;
}

/**
 * 填充分类筛选器
 */
export function populateCategoryFilter(items) {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(items.map(item => item.category))];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}
