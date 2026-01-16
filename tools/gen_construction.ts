import { construction as oldConstructions } from 'animal-crossing';
import { processImageUrl, save, versionMap } from './util.js';
import { ConstructionType, type Construction } from '../src/types/construction.js';
import { Version } from '../src/types/index.js';

const constructionTypeMap: Record<string, ConstructionType> = {
  Bridge: ConstructionType.Bridge,
  Door: ConstructionType.Door,
  Incline: ConstructionType.Incline,
  Mailbox: ConstructionType.Mailbox,
  Roofing: ConstructionType.Roofing,
  Siding: ConstructionType.Siding,
  Other: ConstructionType.Other,
};

export function genConstruction() {
  let constructions: Construction[] = [];
  let id = 0;
  for (const oldConstruction of oldConstructions) {
    id += 1;
    const newConstruction: Construction = {
      id: id,
      name: oldConstruction.translations?.cNzh || oldConstruction.name || '',
      rawName: oldConstruction.name || '',
      image: processImageUrl(oldConstruction.image),
      ver: versionMap[oldConstruction.versionAdded] || Version.The200,
      buy: oldConstruction.buy || undefined,
      type: constructionTypeMap[oldConstruction.category || 'Other'],
      source: oldConstruction.source || [],
    };
    constructions.push(newConstruction);
  }
  constructions.sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;
    return a.id - b.id;
  });
  return constructions;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genConstruction(), 'acnh-constructions.json');
}
