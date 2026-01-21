import { CreatureType, Version, type Creature, type HemisphereInfo } from '../src/types';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from './util';
import { getSheetDatas, getTrans } from './excel/excel';

const creatureTypeMap: Record<string, CreatureType> = {
  Insects: CreatureType.Insects,
  Fish: CreatureType.Fish,
  'Sea Creatures': CreatureType.SeaCreatures,
};

function convertTime(str: string): number[] {
  if (str === 'All day') {
    return Array.from({ length: 24 }, (_, i) => i);
  }
  const times: number[] = [];
  const timeStrs = str.split(';').map((s: string) => s.trim());
  for (const tStr of timeStrs) {
    const [sStr, eStr] = tStr.split('–').map((s) => s.trim());
    const [sHour, sAMorPM] = sStr.split(' ');
    const [eHour, eAMorPM] = eStr.split(' ');
    let s = Number(sHour);
    let e = Number(eHour);
    if (sAMorPM === 'PM' && s !== 12) {
      s += 12;
    }
    if (eAMorPM === 'PM' && e !== 12) {
      e += 12;
    }
    for (let h = s; ; h++) {
      times.push(h % 24);
      if (h % 24 === e) {
        break;
      }
    }
  }
  return times;
}

export function genCreature() {
  const sheetDatas = getSheetDatas();
  const keys = ['Insects', 'Fish', 'Sea Creatures'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let creatures: Creature[] = [];

  for (const key of keys) {
    for (const sheetData of sheetDatas[key]) {
      const id = Number(sheetData['Internal ID']);
      const name = getTrans('Items', id)!;
      let northHemisphereInfo: HemisphereInfo = {
        months: [],
        hours: [],
      };
      let southHemisphereInfo: HemisphereInfo = {
        months: [],
        hours: [],
      };
      for (const m of months) {
        if (sheetData[`NH ${m}`] && sheetData[`NH ${m}`] !== 'NA') {
          northHemisphereInfo.months.push(months.indexOf(m) + 1);
          northHemisphereInfo.hours = convertTime(sheetData[`NH ${m}`]);
        }

        if (sheetData[`SH ${m}`] && sheetData[`SH ${m}`] !== 'NA') {
          southHemisphereInfo.months.push(months.indexOf(m) + 1);
          southHemisphereInfo.hours = convertTime(sheetData[`SH ${m}`]);
        }
      }

      let hemispheres = {
        north: northHemisphereInfo,
        south: southHemisphereInfo,
      };
      const creature: Creature = {
        id: id,
        order: Number(sheetData['#']),
        type: creatureTypeMap[key],
        name: name,
        rawName: sheetData['Name'],
        images: [processImageUrl(sheetData['Critterpedia Image'])],
        ver: sheetData['Version Added']
          ? versionMap[sheetData['Version Added']]
          : Version.The100,
        colors: Array.from(
          new Set([sheetData['Color 1'], sheetData['Color 2']].filter(Boolean))
        ).map((c) => colorMap[c]),
        size: sizeMap[sheetData['Size']],
        sell: Number(sheetData['Sell']),
        whereHow: sheetData['Where/How'] || undefined,
        weather: sheetData['Weather'] || undefined,
        hemispheres: hemispheres,
        catchPhrase: sheetData['Catch phrase'],
        desc: sheetData['Description'],
        rate: String(sheetData['Spawn Rates']),
        unlock: sheetData['Total Catches to Unlock'] || 0,
        shadowSize: sheetData['Shadow'] || undefined,
        difficulty:
          sheetData['Catch Difficulty'] || sheetData['Movement Speed'] || undefined,
      };
      creatures.push(creature);
    }
  }
  creatures.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type - b.type;
    }
    return a.order - b.order;
  });

  return creatures;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genCreature(), 'acnh-creatures.json');
}
