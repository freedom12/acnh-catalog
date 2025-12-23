/**
 * 表情反应数据类型
 */
export interface Reaction {
  sourceSheet: string;
  num: number;
  name: string;
  image: string;
  source: string[];
  sourceNotes: string | null;
  seasonEvent: string | null;
  seasonEventExclusive: string | null;
  versionAdded: string;
  iconFilename: string;
  internalId: number;
  uniqueEntryId: string;
  translations?: {
    sourceSheet: string;
    id: string;
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
}
