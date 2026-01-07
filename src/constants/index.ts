/**
 * 应用常量定义
 * 集中管理所有魔法数字和字符串常量
 */

/**
 * 数据加载相关
 */
export const DATA_LOADING = {
  ITEMS: "正在加载物品数据...",
  VILLAGERS: "正在加载村民数据...",
  NPCS: "正在加载NPC数据...",
  CREATURES: "正在加载生物数据...",
  REACTIONS: "正在加载表情反应数据...",
  RECIPES: "正在加载DIY配方数据...",
  CONSTRUCTION: "正在加载改建数据...",
  MESSAGE_CARDS: "正在加载贺卡数据...",
  ARTWORKS: "正在加载艺术品数据...",
  FOSSILS: "正在加载化石数据...",
  ERROR_GENERIC: "加载数据失败",
} as const;

/**
 * 实体类型emoji图标
 */
export const ENTITY_ICONS = {
  ITEMS: "🪑",
  VILLAGERS: "🐾",
  NPCS: "✨",
  CREATURES: "🦋",
  REACTIONS: "😊",
  RECIPES: "📜",
  CONSTRUCTION: "🏗️",
  MESSAGE_CARDS: "💌",
  ARTWORKS: "🎨",
  FOSSILS: "🦕",
  // 生物类型
  INSECTS: "🦋",
  FISH: "🐟",
  SEA_CREATURES: "🦞",
  // 性别
  MALE: "♂️",
  FEMALE: "♀️",
} as const;

/**
 * UI文本
 */
export const UI_TEXT = {
  LABELS: {
    PRICE: "出售",
    LOCATION: "位置",
    SIZE: "大小",
    SOURCE: "来源",
    VERSION: "版本",
    EVENT: "活动",
    HOBBY: "爱好",
    BIRTHDAY: "生日",
    ID: "ID",
  },
} as const;
