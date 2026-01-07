import type { Version } from "./item";

/**
 * 表情反应数据类型
 */
export interface Reaction {
  id: number;
  order: number;
  name: string;
  rawName: string;
  image: string;
  ver: Version;
  source: string[];
  sourceNotes?: string[];
  activity?: string;
}
