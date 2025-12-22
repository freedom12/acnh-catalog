/**
 * 筛选和排序模块
 */

import { CONFIG, getCategoryName, getSourceName, getCategoryOrder, getSourceOrder } from './config.js';

/**
 * 筛选物品
 */
export function filterItems(allItems, searchTerm, category, ownedFilter, versionFilter, sourceFilter) {
    return allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !category || item.category === category;
        const matchesOwned = ownedFilter === CONFIG.FILTER_OPTIONS.ALL || 
                            (ownedFilter === CONFIG.FILTER_OPTIONS.OWNED && item.owned) ||
                            (ownedFilter === CONFIG.FILTER_OPTIONS.NOT_OWNED && !item.owned);
        const matchesVersion = !versionFilter || item.originalData?.versionAdded === versionFilter;
        const matchesSource = !sourceFilter || (item.originalData?.source && item.originalData.source.includes(sourceFilter));
        return matchesSearch && matchesCategory && matchesOwned && matchesVersion && matchesSource;
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
            // case CONFIG.SORT_OPTIONS.PRICE_ASC:
            //     return (a.price || 0) - (b.price || 0);
            // case CONFIG.SORT_OPTIONS.PRICE_DESC:
            //     return (b.price || 0) - (a.price || 0);
            case CONFIG.SORT_OPTIONS.ID_ASC:
                return (a.id || 0) - (b.id || 0);
            case CONFIG.SORT_OPTIONS.ID_DESC:
                return (b.id || 0) - (a.id || 0);
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
    const itemCategories = new Set(items.map(item => item.category));
    const categoryOrder = getCategoryOrder();
    
    // 按照 translations.json 中定义的顺序显示分类
    const orderedCategories = categoryOrder.filter(cat => itemCategories.has(cat));
    
    // 添加未在 translations 中定义的分类（如果有）
    itemCategories.forEach(cat => {
        if (!categoryOrder.includes(cat)) {
            orderedCategories.push(cat);
        }
    });
    
    orderedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = getCategoryName(category);
        categoryFilter.appendChild(option);
    });
}

/**
 * 填充版本筛选器
 */
export function populateVersionFilter(items) {
    const versionFilter = document.getElementById('versionFilter');
    const versions = [...new Set(items
        .map(item => item.originalData?.versionAdded)
        .filter(v => v))]
        .sort((a, b) => {
            // 按版本号排序
            const aParts = a.split('.').map(Number);
            const bParts = b.split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                const aVal = aParts[i] || 0;
                const bVal = bParts[i] || 0;
                if (aVal !== bVal) return aVal - bVal;
            }
            return 0;
        });
    
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = `v${version}`;
        versionFilter.appendChild(option);
    });
}

/**
 * 填充来源筛选器
 */
export function populateSourceFilter(items) {
    const sourceFilter = document.getElementById('sourceFilter');
    const itemSources = new Set();
    
    items.forEach(item => {
        const sources = item.originalData?.source || [];
        sources.forEach(source => itemSources.add(source));
    });
    
    const sourceOrder = getSourceOrder();
    
    // 按照 translations.json 中定义的顺序显示来源
    const orderedSources = sourceOrder.filter(src => itemSources.has(src));
    
    // 添加未在 translations 中定义的来源（如果有）
    itemSources.forEach(src => {
        if (!sourceOrder.includes(src)) {
            orderedSources.push(src);
        }
    });
    
    orderedSources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = getSourceName(source);
        sourceFilter.appendChild(option);
    });
}
