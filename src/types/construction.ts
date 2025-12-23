import type { Translation } from './index';

/**
 * 改建数据类型
 */
export interface Construction {
  sourceSheet: string;
  name: string;
  image: string;
  buy: number;
  category: string;
  source: string[];
  filename: string;
  versionAdded: string;
  uniqueEntryId: string;
  translations?: Translation;
}
