/**
 * NPC数据类型
 */
export interface NPC {
  sourceSheet: string;
  name: string;
  iconImage: string;
  photoImage: string;
  gender: string;
  genderAsia?: string;
  versionAdded: string | null;
  npcId: string;
  internalId: number;
  birthday: string;
  nameColor: string;
  bubbleColor: string;
  iconFilename: string;
  photoFilename: string;
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
  };
}
