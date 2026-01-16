import { reactions as oldReactions } from 'animal-crossing';
import { processImageUrl, save, versionMap } from './util.js';
import { type Reaction } from '../src/types/index.js';

export function genReaction() {
  let reactions: Reaction[] = [];
  for (const oldReaction of oldReactions) {
    const reaction: Reaction = {
      id: oldReaction.internalId,
      order: oldReaction.num,
      name: oldReaction.translations?.cNzh || oldReaction.name,
      rawName: oldReaction.name,
      image: processImageUrl(oldReaction.image),
      ver: versionMap[oldReaction.versionAdded],
      source: oldReaction.source,
      sourceNotes: oldReaction.sourceNotes || undefined,
    };
    reactions.push(reaction);
  }
  reactions.sort((a, b) => a.order - b.order);
  return reactions;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genReaction(), 'acnh-reactions.json');
}
