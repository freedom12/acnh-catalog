/**
 * 生物数据类型（昆虫、鱼类等）
 */
export interface Creature {
  sourceSheet: string;
  num: number;
  name: string;
  iconImage: string;
  critterpediaImage: string;
  furnitureImage: string;
  sell: number;
  whereHow: string;
  weather: string;
  totalCatchesToUnlock: number;
  spawnRates: string;
  size: string;
  surface?: boolean;
  description?: string[];
  catchPhrase?: string[];
  hhaBasePoints: number;
  hhaCategory: string;
  iconFilename: string;
  critterpediaFilename: string;
  furnitureFilename: string;
  internalId: number;
  uniqueEntryId: string;
  translations?: {
    sourceSheet: string;
    id: number;
    eUde?: string;
    eUen?: string;
    eUit?: string;
    eUnl?: string;
    eUru?: string;
    eUfr?: string;
    eUes?: string;
    uSen?: string;
    uSfr?: string;
    uSes?: string;
    jPja?: string;
    kRko?: string;
    tWzh?: string;
    cNzh?: string;
    plural?: boolean;
  };
  // 时间相关（会在某些生物中出现）
  nMonths?: string[];
  sMonths?: string[];
  time?: string;
  isAllDay?: boolean;
  isAllYear?: boolean;
}
