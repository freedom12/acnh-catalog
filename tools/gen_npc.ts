import { npcs as oldNpcs } from 'animal-crossing';
import { genderMap, processImageUrl, save, versionMap } from './util.js';
import { Version, type NPC } from '../src/types/index.js';

export function genNpc() {
  let npcs: NPC[] = [];
  for (const oldNpc of oldNpcs) {
    if (!oldNpc.iconImage) continue; // 跳过无效数据
    const npc: NPC = {
      id: oldNpc.npcId,
      order: oldNpc.internalId,
      name: oldNpc.translations?.cNzh || oldNpc.name,
      rawName: oldNpc.name,
      images: [
        processImageUrl(oldNpc.iconImage),
        processImageUrl(oldNpc.photoImage || ''),
      ].filter((url) => url !== ''),
      ver: oldNpc.versionAdded ? versionMap[oldNpc.versionAdded] : Version.The100,
      gender: genderMap[oldNpc.gender],
      birthday: oldNpc.birthday,
      nameColor: oldNpc.nameColor!,
      bubbleColor: oldNpc.bubbleColor!,
    };
    npcs.push(npc);
  }
  npcs.sort((a, b) => a.order - b.order);
  return npcs;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genNpc(), 'acnh-npcs.json');
}
