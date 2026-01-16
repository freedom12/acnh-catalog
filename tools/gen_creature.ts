import { CreatureType, Version, type Creature } from "../src/types";
import {
  creatures as oldCreatures,
} from 'animal-crossing';
import { colorMap, processImageUrl, save, sizeMap, versionMap } from "./util";

const creatureTypeMap: Record<string, CreatureType> = {
  Insects: CreatureType.Insects,
  Fish: CreatureType.Fish,
  'Sea Creatures': CreatureType.SeaCreatures,
};

export function genCreature() {
  let creatures: Creature[] = [];
  for (const oldCreature of oldCreatures) {
    const creature: Creature = {
      id: oldCreature.internalId,
      order: oldCreature.num,
      type: creatureTypeMap[oldCreature.sourceSheet],
      name: oldCreature.translations?.cNzh || oldCreature.name,
      rawName: oldCreature.name,
      images: [processImageUrl(oldCreature.critterpediaImage)],
      ver: oldCreature.versionAdded
        ? versionMap[oldCreature.versionAdded]
        : Version.The100,
      colors: Array.from(new Set(oldCreature.colors.map((c) => colorMap[c]))),
      size: sizeMap[oldCreature.size],
      sell: oldCreature.sell,
      whereHow: oldCreature.whereHow ?? undefined,
      weather: oldCreature.weather ?? undefined,
      hemispheres: oldCreature.hemispheres,
      catchPhrase: oldCreature.catchPhrase![0]!,
      desc: oldCreature.description![0]!,
      rate: oldCreature.spawnRates!,
      unlock: oldCreature.totalCatchesToUnlock || 0,
      shadowSize: oldCreature.shadow ?? undefined,
      difficulty: oldCreature.catchDifficulty ?? oldCreature.movementSpeed ?? undefined,
    };
    creatures.push(creature);
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
