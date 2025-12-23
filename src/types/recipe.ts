import type { Translation } from './index';

/**
 * DIY配方数据类型
 */
export interface Recipe {
  sourceSheet: string;
  name: string;
  image: string;
  imageSh: string | null;
  buy: number;
  sell: number;
  exchangePrice: number | null;
  exchangeCurrency: string | null;
  source: string[];
  sourceNotes: string | null;
  seasonEvent: string | null;
  seasonEventExclusive: boolean | null;
  versionAdded: string;
  unlocked: boolean;
  recipesToUnlock: number;
  category: string;
  craftedItemInternalId: number;
  cardColor: string;
  diyIconFilename: string;
  diyIconFilenameSh: string | null;
  serialId: number;
  internalId: number;
  uniqueEntryId: string;
  translations?: Translation;
  materials?: Record<string, number>;
  materialsTranslations?: Record<string, string | null>;
}
