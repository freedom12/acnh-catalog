/**
 * 类型定义文件
 * 包含应用中使用的所有 TypeScript 接口和类型定义
 */
export * from './item';
export * from './villager';
export * from './npc';
export * from './creature';
export * from './reaction';
export * from './messagecard';
export * from './artwork';
export * from './fossil';

export interface Translation {
  cNzh: string;
}

export interface Translations {
  sources: Record<string, string>;
  tags: Record<string, string>;
  series: Record<string, string>;
  concepts: Record<string, string>;
  styles: Record<string, string>;
  themes: Record<string, string>;
  sets: Record<string, string>;
  categories: Record<string, string>;
  activitys: Record<string, string>;
  itemVariantTitles: Record<string, string>;
}
