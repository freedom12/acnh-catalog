/**
 * 应用配置文件
 */

export const CONFIG = {
    // 数据文件路径
    DATA_FILES: {
        ITEMS: 'config/acnh-items.json',
        CATALOG: 'catalog_items.json',
        TRANSLATIONS: 'config/translations.json'
    },
    
    // 分页配置
    PAGINATION: {
        DEFAULT_PER_PAGE: 100,
        OPTIONS: [20, 40, 60, 100, 'all']
    },
    
    // 排序选项
    SORT_OPTIONS: {
        NAME_ASC: 'name-asc',
        NAME_DESC: 'name-desc',
        ID_ASC: 'id-asc',
        ID_DESC: 'id-desc'
    },
    
    // 筛选选项
    FILTER_OPTIONS: {
        ALL: 'all',
        OWNED: 'owned',
        NOT_OWNED: 'not-owned'
    }
};

// 翻译缓存
let translationsCache = null;

// 加载翻译数据
export async function loadTranslations() {
    if (translationsCache) {
        return translationsCache;
    }
    
    try {
        const response = await fetch(CONFIG.DATA_FILES.TRANSLATIONS);
        translationsCache = await response.json();
        return translationsCache;
    } catch (error) {
        console.error('加载翻译数据失败:', error);
        return { categories: {}, sources: {} };
    }
}

// 获取分类的中文名称
export function getCategoryName(category) {
    if (!translationsCache || !translationsCache.categories) {
        return category;
    }
    return translationsCache.categories[category] || category;
}

// 获取来源的中文名称
export function getSourceName(source) {
    if (!translationsCache || !translationsCache.sources) {
        return source;
    }
    return translationsCache.sources[source] || source;
}

// 获取颜色的中文名称
export function getColorName(color) {
    if (!translationsCache || !translationsCache.colors) {
        return color;
    }
    return translationsCache.colors[color] || color;
}

// 获取标签的中文名称
export function getTagName(tag) {
    if (!translationsCache || !translationsCache.tags) {
        return tag;
    }
    return translationsCache.tags[tag] || tag;
}

// 获取系列的中文名称
export function getSeriesName(series) {
    if (!translationsCache || !translationsCache.series) {
        return series;
    }
    return translationsCache.series[series] || series;
}

// 获取所有分类的排序顺序
export function getCategoryOrder() {
    if (!translationsCache || !translationsCache.categories) {
        return [];
    }
    return Object.keys(translationsCache.categories);
}

// 获取所有来源的排序顺序
export function getSourceOrder() {
    if (!translationsCache || !translationsCache.sources) {
        return [];
    }
    return Object.keys(translationsCache.sources);
}

// 获取所有颜色的排序顺序
export function getColorOrder() {
    if (!translationsCache || !translationsCache.colors) {
        return [];
    }
    return Object.keys(translationsCache.colors);
}
