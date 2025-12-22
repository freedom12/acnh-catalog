/**
 * 筛选和排序模块
 */

import { CONFIG, getCategoryName, getSourceName, getColorName, getTagName, getSeriesName, getCategoryOrder, getSourceOrder, getColorOrder } from './config.js';

/**
 * 筛选物品
 */
export function filterItems(allItems, searchTerm, category, ownedFilter, versionFilter, sourceFilter, sizeFilter, tagFilter, colorFilter, seriesFilter) {
    return allItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !category || item.category === category;
        const matchesOwned = ownedFilter === CONFIG.FILTER_OPTIONS.ALL || 
                            (ownedFilter === CONFIG.FILTER_OPTIONS.OWNED && item.owned) ||
                            (ownedFilter === CONFIG.FILTER_OPTIONS.NOT_OWNED && !item.owned);
        const matchesVersion = !versionFilter || item.versionAdded === versionFilter;
        const matchesSource = !sourceFilter || (item.source && item.source.includes(sourceFilter));
        const matchesSize = !sizeFilter || item.size === sizeFilter;
        const matchesTag = !tagFilter || item.tag === tagFilter;
        const matchesSeries = !seriesFilter || item.series === seriesFilter;
        let matchesColor = !colorFilter || (item.colors && item.colors.includes(colorFilter));
        for (var i = 0; i < (item.variantGroups ? item.variantGroups.length : 0); i++) {
            var variation = item.variantGroups[i];
            for (var j = 0; j < (variation.patterns ? variation.patterns.length : 0); j++) {
                var pattern = variation.patterns[j];
                if (pattern.colors && pattern.colors.includes(colorFilter)) {
                    matchesColor = true;
                    item.vIndex = i;
                    item.pIndex = j;
                    break;
                }
            }
            if (matchesColor) {
                break;
            }
        }

        
        const matches = matchesSearch && matchesCategory && matchesOwned && matchesVersion && matchesSource && matchesSize && matchesTag && matchesColor && matchesSeries;
        
        // 如果有颜色筛选且物品匹配，调整显示的变体
        if (matches && colorFilter && item.hasVariations && item.variantGroups) {
            // 查找第一个包含该颜色的变体
            for (const variantGroup of item.variantGroups) {
                for (const pattern of variantGroup.patterns) {
                    if (pattern.colors && pattern.colors.includes(colorFilter)) {
                        // 更新物品的显示信息为这个变体
                        item.id = pattern.id;
                        item.imageUrl = pattern.imageUrl;
                        return true;
                    }
                }
            }
        }
        
        return matches;
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
        .map(item => item.versionAdded)
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
        const sources = item.source || [];
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

/**
 * 填充尺寸筛选器
 */
export function populateSizeFilter(items) {
    const sizeFilter = document.getElementById('sizeFilter');
    const sizes = [...new Set(items
        .map(item => item.size)
        .filter(s => s))]
        .sort((a, b) => {
            // 按尺寸排序，例如 1x1, 1x2, 2x1, 2x2 等
            const [aWidth, aHeight] = a.split('x').map(Number);
            const [bWidth, bHeight] = b.split('x').map(Number);
            if (aWidth !== bWidth) return aWidth - bWidth;
            return aHeight - bHeight;
        });
    
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeFilter.appendChild(option);
    });
}

/**
 * 填充标签筛选器
 */
export function populateTagFilter(items) {
    const tagFilter = document.getElementById('tagFilter');
    const tags = [...new Set(items
        .map(item => item.tag)
        .filter(t => t))]
        .sort((a, b) => getTagName(a).localeCompare(getTagName(b), 'zh-CN'));
    
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = getTagName(tag);
        tagFilter.appendChild(option);
    });
}

/**
 * 填充颜色筛选器
 */
export function populateColorFilter(items) {
    const colorFilter = document.getElementById('colorFilter');
    const itemColors = new Set();
    const colorOrder = getColorOrder();
    
    items.forEach(item => {
        const colors = item.colors || [];
        colors.forEach(color => itemColors.add(color));
    });
    
    // 按照 translations.json 中定义的顺序显示颜色
    const orderedColors = colorOrder.filter(color => itemColors.has(color));
    
    // 添加未在 translations 中定义的颜色（如果有）
    itemColors.forEach(color => {
        if (!orderedColors.includes(color)) {
            orderedColors.push(color);
        }
    });
    
    orderedColors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = getColorName(color);
        colorFilter.appendChild(option);
    });
}

/**
 * 填充系列筛选器
 */
export function populateSeriesFilter(items) {
    const seriesFilter = document.getElementById('seriesFilter');
    const seriesMap = new Map(); // 用于存储 series -> seriesName 的映射
    
    items.forEach(item => {
        if (item.series && !seriesMap.has(item.series)) {
            seriesMap.set(item.series, item.seriesName || item.series);
        }
    });
    
    // 按中文名称排序
    const sortedSeries = [...seriesMap.entries()].sort((a, b) => {
        return a[1].localeCompare(b[1], 'zh-CN');
    });
    
    sortedSeries.forEach(([seriesValue, seriesName]) => {
        const option = document.createElement('option');
        option.value = seriesValue;
        option.textContent = seriesName;
        seriesFilter.appendChild(option);
    });
}
