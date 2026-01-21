import { processImageUrl, save, versionMap } from './util.js';
import { ConstructionType, type Construction } from '../src/types/construction.js';
import { Version } from '../src/types/index.js';
import { getSheetDatas, getTransDatas } from './excel/excel.js';

const constructionTypeMap: Record<string, ConstructionType> = {
  Bridge: ConstructionType.Bridge,
  Door: ConstructionType.Door,
  Incline: ConstructionType.Incline,
  Mailbox: ConstructionType.Mailbox,
  Roof: ConstructionType.Roof,
  Siding: ConstructionType.Siding,
  // Other: ConstructionType.Other,
};

export function genConstruction() {
  const sheetDatas = getSheetDatas();
  const constructionSheetDatas = sheetDatas['Construction'];
  const transDatas = getTransDatas();
  const keys = [
    'House Mailboxes',
    'House Roofs',
    'House Walls',
    'House Doors',
    'Construction',
  ];
  let constructions: Construction[] = [];
  let transMap: Record<string, [number, string]> = {};
  for (const key of keys) {
    for (const [idstr, trans] of Object.entries(transDatas[key] || {})) {
      let id = Number(idstr);
      if (isNaN(id)) {
        const l = idstr.split('_');
        id = Number(l[1]);
      }
      if (isNaN(id)) {
        console.warn(`Invalid construction id: ${idstr}`);
        continue;
      }

      let rawName = trans['USen'];
      let name = trans['CNzh'];
      transMap[rawName] = [id, name];
    }
  }

  let index = 0;
  for (const sheetData of constructionSheetDatas) {
    let trans = transMap[sheetData['Name']];
    if (!trans) {
      console.warn(`Construction trans not found: ${sheetData['Name']}`);
      continue;
    }
    index++;
    const construction: Construction = {
      id: index,
      order: trans[0],
      name: trans[1],
      rawName: sheetData['Name'],
      image: processImageUrl(sheetData['Image']),
      ver: versionMap[sheetData['Version Added']] || Version.The200,
      buy: Number(sheetData['Buy']) || undefined,
      type: constructionTypeMap[sheetData['Category'] || 'Other'],
      source: [sheetData['Source']],
    };
    constructions.push(construction);
  }

  constructions.sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;
    return a.order - b.order;
  });
  return constructions;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genConstruction(), 'acnh-constructions.json');
}
