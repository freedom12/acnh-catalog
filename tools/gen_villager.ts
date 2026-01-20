import { villagers as oldVillagers } from 'animal-crossing';
import {
  colorMap,
  genderMap,
  hobbyMap,
  personalityMap,
  processFurnitureString,
  processImageUrl,
  save,
  speciesMap,
  versionMap,
} from './util.js';
import { type Item, type Villager } from '../src/types/index.js';
import { genItem } from './gen_item.js';
import { getSheetDatas, getTrans } from './excel/excel.js';

export function genVillagerV1(items?: Item[]): Villager[] {
  items = items || genItem();
  let itemMap = new Map<string, Item>();
  for (const item of items) {
    itemMap.set(item.nr, item);
  }
  let villagers: Villager[] = [];
  for (const oldVillager of oldVillagers) {
    const newVillager: Villager = {
      id: oldVillager.filename,
      name: oldVillager.translations?.cNzh || oldVillager.name,
      rawName: oldVillager.name,
      images: [
        processImageUrl(oldVillager.iconImage),
        processImageUrl(oldVillager.photoImage),
      ].filter((url) => url !== ''),
      ver: versionMap[oldVillager.versionAdded],
      species: speciesMap[oldVillager.species],
      gender: genderMap[oldVillager.gender],
      personality: personalityMap[oldVillager.personality],
      subtype: oldVillager.subtype,
      hobby: hobbyMap[oldVillager.hobby],
      birthday: oldVillager.birthday,
      styles: Array.from(new Set(oldVillager.styles)),
      colors: Array.from(new Set(oldVillager.colors.map((c) => colorMap[c]))),
      catchphrase: oldVillager.catchphrases.cNzh,
      saying: oldVillager.favoriteSaying,

      song: itemMap.get(oldVillager.favoriteSong)?.id || 0,
      clothing: itemMap.get(oldVillager.defaultClothing)?.id || 0,
      umbrella: itemMap.get(oldVillager.defaultUmbrella)?.id || 0,
      wallpaper: itemMap.get(oldVillager.wallpaper)?.id || 0,
      flooring: itemMap.get(oldVillager.flooring)?.id || 0,
      furnitures: oldVillager.furnitureList,
      diyWorkbench: processFurnitureString(String(oldVillager.diyWorkbench)),
      kitchenware: processFurnitureString(String(oldVillager.kitchenEquipment)),
      houseImage: oldVillager.houseImage
        ? processImageUrl(oldVillager.houseImage)
        : undefined,
      bubbleColor: oldVillager.bubbleColor,
      nameColor: oldVillager.nameColor,
    };
    villagers.push(newVillager);
  }
  villagers.sort((a, b) => a.id.localeCompare(b.id));
  return villagers;
}

export function genVillagerFromExcel(items?: Item[]): Villager[] {
  const sheetDatas = getSheetDatas();
  items = items || genItem();
  const itemMap = new Map<string, Item>();
  for (const item of items) {
    itemMap.set(item.nr, item);
  }
  const villagers: Villager[] = [];
  for (const sheetData of sheetDatas['Villagers']) {
    const id = sheetData['Filename'];
    const images = [sheetData['Icon Image'], sheetData['Photo Image']].map(
      processImageUrl
    );

    let villager: Villager = {
      id: id,
      name: getTrans('Villagers', id) || sheetData['Name'],
      rawName: sheetData['Name'],
      images: images,
      ver: versionMap[sheetData['Version Added']],
      species: speciesMap[sheetData['Species']],
      gender: genderMap[sheetData['Gender']],
      personality: personalityMap[sheetData['Personality']],
      subtype: sheetData['Subtype'],
      hobby: hobbyMap[sheetData['Hobby']],
      birthday: sheetData['Birthday'],
      styles: Array.from(
        new Set([sheetData['Style 1'], sheetData['Style 2']].filter(Boolean))
      ),
      colors: Array.from(
        new Set([sheetData['Color 1'], sheetData['Color 2']].filter(Boolean))
      ).map((c) => colorMap[c]),
      catchphrase: getTrans('Villager Catchphrases', id) || sheetData['Catchphrase'],
      saying: sheetData['Favorite Saying'],

      song: itemMap.get(sheetData['Favorite Song'])?.id || 0,
      clothing: sheetData['Default Clothing'] || 0,
      umbrella: itemMap.get(sheetData['Default Umbrella'])?.id || 0,
      wallpaper: itemMap.get(sheetData['Wallpaper'])?.id || 0,
      flooring: itemMap.get(sheetData['Flooring'])?.id || 0,
      furnitures: sheetData['Furniture List']
        .split(';')
        .map((s: string) => Number(s.trim())),
      diyWorkbench: processFurnitureString(String(sheetData['DIY Workbench'])),
      kitchenware: processFurnitureString(String(sheetData['Kitchen Equipment'])),
      houseImage: sheetData['House Image']
        ? processImageUrl(sheetData['House Image'])
        : undefined,
      bubbleColor: sheetData['Bubble Color'],
      nameColor: sheetData['Name Color'],
    };
    villagers.push(villager);
  }
  villagers.sort((a, b) => a.id.localeCompare(b.id));
  return villagers;
}

export const genVillager = genVillagerFromExcel;

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genVillager(), 'acnh-villagers.json');
}
