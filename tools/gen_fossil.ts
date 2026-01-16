import {
  ItemSourceSheet as OldItemSourceSheet,
  type Item as OldItem,
} from 'animal-crossing/lib/types/Item';
import { items as oldItems } from 'animal-crossing';
import { processImageUrl, save, sizeMap } from './util.js';
import { FossilType, type Fossil } from '../src/types/index.js';
import { getAcnhLocale } from './acnh/index.js';

const fossilTypeMap: Record<string, FossilType> = {
  'Room 1': FossilType.PZ,
  'Room 2': FossilType.MZ,
  'Room 3': FossilType.CZ,
};

export function genFossil() {
  let fossilGroups = new Map<string, OldItem[]>();
  for (const oldItem of oldItems) {
    if (oldItem.sourceSheet === OldItemSourceSheet.Fossils) {
      let groupName = oldItem.fossilGroup!;
      if (!fossilGroups.has(groupName)) {
        fossilGroups.set(groupName, []);
      }
      fossilGroups.get(groupName)!.push(oldItem);
    }
  }
  let fossils: Fossil[] = [];
  for (const [groupName, parts] of fossilGroups) {
    let name = parts[0].translations?.cNzh || parts[0].name;
    if (parts.length > 1) {
      name = groupName.toLowerCase().replace(/ /g, '_').replace(/\./g, '');
      name = getAcnhLocale(name, 'fgr');
    }

    const fossil: Fossil = {
      name,
      type: fossilTypeMap[parts[0].museum!],
      parts: parts
        .sort((a, b) => a.internalId! - b.internalId!)
        .map((part) => ({
          id: part.internalId!,
          name: part.name,
          image: processImageUrl(part.image!),
          size: sizeMap[part.size!],
          sell: part.sell!,
        })),
      desc: parts[0].description![0]!,
    };
    fossils.push(fossil);
  }
  fossils.sort((a, b) => a.type - b.type);
  return fossils;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genFossil(), 'acnh-fossils.json');
}
