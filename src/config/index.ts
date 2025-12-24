/**
 * 应用配置常量
 */
const BASE_PATH = import.meta.env.BASE_URL;

/**
 * 数据文件路径配置
 */
export const CONFIG = {
  DATA_FILES: {
    ITEMS: `${BASE_PATH}config/acnh-items.json`,
    CATALOG: `${BASE_PATH}catalog_items.json`,
    TRANSLATIONS: `${BASE_PATH}config/translations.json`,
    VILLAGERS: `${BASE_PATH}config/acnh-villagers.json`,
    NPCS: `${BASE_PATH}config/acnh-npcs.json`,
    CREATURES: `${BASE_PATH}config/acnh-creatures.json`,
    REACTIONS: `${BASE_PATH}config/acnh-reactions.json`,
    RECIPES: `${BASE_PATH}config/acnh-recipes.json`,
    CONSTRUCTION: `${BASE_PATH}config/acnh-construction.json`,
  },

  /**
   * 分页配置
   */
  PAGINATION: {
    DEFAULT_PER_PAGE: 100,
    OPTIONS: [20, 40, 60, 100, "all"] as const,
  },

  /**
   * 排序选项
   */
  SORT_OPTIONS: {
    NAME_ASC: "name-asc",
    NAME_DESC: "name-desc",
    ID_ASC: "id-asc",
    ID_DESC: "id-desc",
  } as const,

  /**
   * 筛选选项
   */
  FILTER_OPTIONS: {
    ALL: "all",
    OWNED: "owned",
    NOT_OWNED: "not-owned",
  } as const,
} as const;

/**
 * 颜色映射表
 * 将颜色名称映射到 CSS 颜色值
 */
export const COLOR_MAP: Record<string, string> = {
  Red: "#e74c3c",
  Orange: "#e67e22",
  Yellow: "#f1c40f",
  Green: "#27ae60",
  Blue: "#3498db",
  Aqua: "#1abc9c",
  Purple: "#9b59b6",
  Pink: "#ff69b4",
  White: "#ecf0f1",
  Black: "#2c3e50",
  Gray: "#95a5a6",
  Brown: "#8b6f47",
  Beige: "#d4c5b9",
} as const;
