/**
 * 应用配置文件
 */

export const CONFIG = {
    // 数据文件路径
    DATA_FILES: {
        ITEMS: 'config/acnh-items.json',
        CATALOG: 'catalog_items.json'
    },
    
    // 分页配置
    PAGINATION: {
        DEFAULT_PER_PAGE: 40,
        OPTIONS: [20, 40, 60, 100, 'all']
    },
    
    // 排序选项
    SORT_OPTIONS: {
        NAME_ASC: 'name-asc',
        NAME_DESC: 'name-desc',
        PRICE_ASC: 'price-asc',
        PRICE_DESC: 'price-desc',
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
