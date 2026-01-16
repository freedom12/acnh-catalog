import { reactions as oldReactions } from 'animal-crossing';
import { processImageUrl, save, versionMap } from './util.js';
import { type Reaction } from '../src/types/index.js';
import { getAcnhReactionData } from './acnh/index.js';

export function genReaction() {
  let reactions: Reaction[] = [];
  for (const oldReaction of oldReactions) {
    let acnhReactionData = getAcnhReactionData(oldReaction.internalId);
    if (!acnhReactionData) {
      console.warn(
        `acnhReactionData not found: id=${oldReaction.internalId}, name=${oldReaction.translations.cNzh}`
      );
    }
    let acts = acnhReactionData?.evt;
    if (typeof acts === 'string') {
      acts = [acts];
    }
    const reaction: Reaction = {
      id: oldReaction.internalId,
      order: oldReaction.num,
      name: oldReaction.translations?.cNzh || oldReaction.name,
      rawName: oldReaction.name,
      image: processImageUrl(oldReaction.image),
      ver: versionMap[oldReaction.versionAdded],
      acts: acts,
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
