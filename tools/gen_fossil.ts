import { processImageUrl, save, sizeMap } from './util.js';
import { FossilType, type Fossil } from '../src/types/index.js';
import { getSheetDatas, getTransDatas } from './excel/excel.js';

const fossilTypeMap: Record<string, FossilType> = {
  'Room 1': FossilType.PZ,
  'Room 2': FossilType.MZ,
  'Room 3': FossilType.CZ,
};

export function genFossil() {
  const transDatas = getTransDatas();
  const fossilTransMap: Record<string, string> = {};
  for (const [_, trans] of Object.entries(transDatas['Fossil Groups'])) {
    fossilTransMap[trans['USen']] = trans['CNzh'];
  }
  const sheetDatas = getSheetDatas();
  const fossilSheetDatas = sheetDatas['Fossils'];
  let fossilGroupMap: Record<string, any[]> = {};
  for (const sheetData of fossilSheetDatas) {
    let groupName: string = sheetData['Fossil Group'];
    if (!fossilGroupMap[groupName]) {
      fossilGroupMap[groupName] = [];
    }
    fossilGroupMap[groupName].push(sheetData);
  }
  let fossils: Fossil[] = [];
  for (const [groupName, parts] of Object.entries(fossilGroupMap)) {
    let name = fossilTransMap[groupName];
    if (!name) {
      console.warn(`Missing translation for fossil group: ${groupName}`);
      name = groupName;
    }
    const sheetData = parts[0];
    const fossil: Fossil = {
      name,
      rawName: groupName,
      type: fossilTypeMap[sheetData['Museum']],
      parts: parts
        .sort((a, b) => Number(a['Internal ID']) - Number(b['Internal ID']))
        .map((part) => ({
          id: Number(part['Internal ID']),
          name: part['Name'],
          image: processImageUrl(part['Image']),
          size: sizeMap[part['Size']],
          sell: Number(part['Sell']),
        })),
      desc: sheetData['Description'],
    };
    fossils.push(fossil);
  }
  fossils.sort((a, b) => a.type - b.type || a.parts.length - b.parts.length);
  return fossils;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genFossil(), 'acnh-fossils.json');
}
