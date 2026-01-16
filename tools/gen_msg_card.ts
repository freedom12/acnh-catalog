import {
  ItemSourceSheet as OldItemSourceSheet,
} from 'animal-crossing/lib/types/Item';
import { items as oldItems } from 'animal-crossing';
import { processImageUrl, save, versionMap } from './util.js';
import { Version, type MessageCard } from '../src/types/index.js';


export function genMsgCard() {
  let messageCards: MessageCard[] = [];
  for (const oldItem of oldItems) {
    if (oldItem.sourceSheet === OldItemSourceSheet.MessageCards) {
      const messageCard: MessageCard = {
        id: oldItem.internalId || 0,
        name: oldItem.translations?.cNzh || oldItem.name,
        rawName: oldItem.name,
        image: processImageUrl(oldItem.image || ''),
        ver: versionMap[oldItem.version!] || Version.The100,
        buy: oldItem.buy ?? undefined,
        backColor: oldItem.backColor || undefined,
        bodyColor: oldItem.bodyColor!,
        headColor: oldItem.headColor!,
        footColor: oldItem.footColor!,
        penColors: [
          oldItem.penColor1!,
          oldItem.penColor2!,
          oldItem.penColor3!,
          oldItem.penColor4!,
        ],
        startDate: oldItem.startDate || undefined,
        endDate: oldItem.endDate || undefined,
        nhStartDate: oldItem.nhStartDate || undefined,
        nhEndDate: oldItem.nhEndDate || undefined,
        shStartDate: oldItem.shStartDate || undefined,
        shEndDate: oldItem.shEndDate || undefined,
      };
      messageCards.push(messageCard);
    }
  }

  messageCards.sort((a, b) => a.id - b.id);
  return messageCards;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genMsgCard(), 'acnh-message-cards.json');
}
