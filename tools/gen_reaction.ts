import { processImageUrl, save, versionMap } from './util.js';
import { type Reaction } from '../src/types/index.js';
import { getAcnhReactionData } from './acnh/index.js';
import { getSheetDatas, getTransDatas } from './excel/excel.js';

export function genReaction() {
  const transDatas = getTransDatas();
  const reactionTransMap: Record<string, string> = {};
  for (const [_, trans] of Object.entries(transDatas['Reactions'])) {
    reactionTransMap[trans['USen']] = trans['CNzh'];
  }
  const sheetDatas = getSheetDatas();
  const villagerSheetDatas = sheetDatas['Reactions'];
  let reactions: Reaction[] = [];
  for (const sheetData of villagerSheetDatas) {
    let id = sheetData['Internal ID'];
    let order = sheetData['#'];
    let name = reactionTransMap[sheetData['Name']];
    if (!name) {
      console.warn(`Missing translation for reaction: ${sheetData['Name']}`);
      name = sheetData['Name'];
    }
    let acnhReactionData = getAcnhReactionData(order);
    if (!acnhReactionData) {
      console.warn(`acnhReactionData not found: id=${id}, name=${sheetData['Name']}`);
    }
    let acts = acnhReactionData?.evt;
    if (typeof acts === 'string') {
      acts = [acts];
    }
    const reaction: Reaction = {
      id: id,
      order: order,
      name: name,
      rawName: sheetData['Name'],
      image: processImageUrl(sheetData['Image']),
      ver: versionMap[sheetData['Version Added']],
      acts: acts,
      source: [sheetData['Source']],
      sourceNotes: sheetData['Source Notes'] ? [sheetData['Source Notes']] : undefined,
    };
    reactions.push(reaction);
  }
  reactions.sort((a, b) => a.order - b.order);
  return reactions;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genReaction(), 'acnh-reactions.json');
}
