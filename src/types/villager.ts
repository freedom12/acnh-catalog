/**
 * 村民数据类型
 */
export interface Villager {
  sourceSheet: string;
  name: string;
  iconImage: string;
  photoImage: string;
  houseImage: string | null;
  species: string;
  gender: string;
  personality: string;
  subtype: string;
  hobby: string;
  birthday: string;
  catchphrase: string;
  favoriteSong: string;
  favoriteSaying: string;
  defaultClothing: string;
  defaultUmbrella: string;
  wallpaper: string;
  flooring: string;
  furnitureList: number[];
  furnitureNameList?: string[];
  diyWorkbench?: string;
  kitchenware?: string;
  versionAdded?: string;
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
