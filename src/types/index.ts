/**
 * 类型定义文件
 * 包含应用中使用的所有 TypeScript 接口和类型定义
 */

// 导出各模块类型
export * from "./item";
export * from "./villager";
export * from "./npc";
export * from "./creature";
export * from "./reaction";
export * from "./messagecard";

/**
 * 翻译接口
 * 包含物品在不同语言版本中的名称
 */
export interface Translation {
  sourceSheet: string;
  id: string | number;
  eUde?: string; // 德语（欧洲）
  eUen?: string; // 英语（欧洲）
  eUit?: string; // 意大利语（欧洲）
  eUnl?: string; // 荷兰语（欧洲）
  eUru?: string; // 俄语（欧洲）
  eUfr?: string; // 法语（欧洲）
  eUes?: string; // 西班牙语（欧洲）
  uSen?: string; // 英语（美国）
  uSfr?: string; // 法语（美国）
  uSes?: string; // 西班牙语（美国）
  jPja?: string; // 日语
  kRko?: string; // 韩语
  tWzh?: string; // 繁体中文（台湾）
  cNzh?: string; // 简体中文（中国）
  plural?: boolean; // 是否为复数形式
}

/**
 * 翻译数据接口
 * 包含各种类型的翻译映射
 */
export interface Translations {
  categories: Record<string, string>; // 分类翻译
  sources: Record<string, string>; // 来源翻译
  colors: Record<string, string>; // 颜色翻译
  tags: Record<string, string>; // 标签翻译
  series: Record<string, string>; // 系列翻译
}

/**
 * 排序选项接口
 * 定义排序方式的显示信息
 */
export interface SortOption {
  value: string; // 排序值
  label: string; // 显示标签
}
