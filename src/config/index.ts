import { Color } from "../types";

/**
 * 应用配置常量
 */
const BASE_PATH = import.meta.env.BASE_URL;

/**
 * 数据文件路径配置
 */
export const CONFIG = {
  DATA_FILES: {
    CATALOG: `${BASE_PATH}catalog_items.json`,
    TRANSLATIONS: `${BASE_PATH}translations.json`,
    ITEMS: `${BASE_PATH}config/acnh-items.json`,
    VILLAGERS: `${BASE_PATH}config/acnh-villagers.json`,
    NPCS: `${BASE_PATH}config/acnh-npcs.json`,
    CREATURES: `${BASE_PATH}config/acnh-creatures.json`,
    REACTIONS: `${BASE_PATH}config/acnh-reactions.json`,
    RECIPES: `${BASE_PATH}config/acnh-recipes.json`,
    CONSTRUCTIONS: `${BASE_PATH}config/acnh-constructions.json`,
    MESSAGE_CARDS: `${BASE_PATH}config/acnh-message-cards.json`,
    ARTWORKS: `${BASE_PATH}config/acnh-artworks.json`,
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

export const COLOR_MAP: Record<Color, string> = {
  [Color.Red]: "#e74c3c",
  [Color.Orange]: "#e67e22",
  [Color.Yellow]: "#f1c40f",
  [Color.Green]: "#27ae60",
  [Color.Blue]: "#3498db",
  [Color.Aqua]: "#1abc9c",
  [Color.Purple]: "#9b59b6",
  [Color.Pink]: "#ff69b4",
  [Color.White]: "#ecf0f1",
  [Color.Black]: "#2c3e50",
  [Color.Gray]: "#95a5a6",
  [Color.Brown]: "#8b6f47",
  [Color.Beige]: "#d4c5b9",
  [Color.Colorful]: "#000000",
} as const;
