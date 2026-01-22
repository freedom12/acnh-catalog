import { genderMap, hobbyMap, processImageUrl, save, versionMap } from './util.js';
import { Version, type Item, type NPC } from '../src/types/index.js';
import { getSheetDatas, getTrans } from './excel/excel.js';
import { genItem } from './gen_item.js';

export function genNpc(items?: Item[]) {
  items = items || genItem();
  let itemMap = new Map<string, Item>();
  for (const item of items) {
    itemMap.set(item.nr, item);
  }

  const sheetDatas = getSheetDatas();
  const npcSheetDatas = sheetDatas['Special NPCs'];

  let npcs: NPC[] = [];
  for (const sheetData of npcSheetDatas) {
    if (!sheetData['Icon Image'] || sheetData['Icon Image'] === 'NA') continue; // 跳过无效数据

    let id = sheetData['NPC ID'];
    let name = getTrans('Special NPCs', id);
    if (!name) {
      name = sheetData['Name'];
      console.log(`Missing translation for NPC ID: ${id}, using raw name: ${name}`);
    }
    const npc: NPC = {
      id: id,
      order: sheetData['Internal ID'],
      name: name || '',
      rawName: sheetData['Name'],
      images: [
        processImageUrl(sheetData['Icon Image']),
        processImageUrl(sheetData['Photo Image']),
      ].filter((url) => url !== 'NA'),
      ver:
        sheetData['Version Added'] && sheetData['Version Added'] !== 'NA'
          ? versionMap[sheetData['Version Added']]
          : Version.The100,
      gender: genderMap[sheetData['Gender']],
      birthday: sheetData['Birthday'],
      hobby: hobbyMap[sheetData['Hobby']],
      umbrella: itemMap.get(sheetData['Umbrella'])?.id,
      umbrellaHHP: itemMap.get(sheetData['Umbrella (HHP)'])?.id,
      nameColor: sheetData['Name Color'],
      bubbleColor: sheetData['Bubble Color'],
    };
    npcs.push(npc);
  }
  npcs.sort((a, b) => a.order - b.order);
  return npcs;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genNpc(), 'acnh-npcs.json');
}
