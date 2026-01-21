import { processImageUrl, save, versionMap } from './util.js';
import { type MessageCard } from '../src/types/index.js';
import { getSheetDatas } from './excel/excel.js';

export function genMsgCard() {
  const sheetDatas = getSheetDatas();
  const msgCardSheetDatas = sheetDatas['Message Cards'];
  let msgCards: MessageCard[] = [];
  for (const sheetdata of msgCardSheetDatas) {
    let id = Number(sheetdata['Internal ID']);
    const messageCard: MessageCard = {
      id: id,
      name: sheetdata['Name'],
      rawName: sheetdata['Name'],
      image: processImageUrl(sheetdata['Image']),
      ver: versionMap[sheetdata['Version Added']],
      buy:
        sheetdata['Buy'] && sheetdata['Buy'] !== 'NSF'
          ? Number(sheetdata['Buy'])
          : undefined,
      backColor:
        sheetdata['Back Color'] && sheetdata['Back Color'] !== 'None'
          ? sheetdata['Back Color']
          : undefined,
      bodyColor: sheetdata['Body Color'],
      headColor: sheetdata['Head Color'],
      footColor: sheetdata['Foot Color'],
      penColors: [
        sheetdata['Pen Color 1'],
        sheetdata['Pen Color 2'],
        sheetdata['Pen Color 3'],
        sheetdata['Pen Color 4'],
      ],
      startDate:
        sheetdata['Start Date'] && sheetdata['Start Date'] !== 'NA'
          ? sheetdata['Start Date']
          : undefined,
      endDate:
        sheetdata['End Date'] && sheetdata['End Date'] !== 'NA'
          ? sheetdata['End Date']
          : undefined,
      nhStartDate:
        sheetdata['NH Start Date'] && sheetdata['NH Start Date'] !== 'NA'
          ? sheetdata['NH Start Date']
          : undefined,
      nhEndDate:
        sheetdata['NH End Date'] && sheetdata['NH End Date'] !== 'NA'
          ? sheetdata['NH End Date']
          : undefined,
      shStartDate:
        sheetdata['SH Start Date'] && sheetdata['SH Start Date'] !== 'NA'
          ? sheetdata['SH Start Date']
          : undefined,
      shEndDate:
        sheetdata['SH End Date'] && sheetdata['SH End Date'] !== 'NA'
          ? sheetdata['SH End Date']
          : undefined,
    };
    msgCards.push(messageCard);
  }

  msgCards.sort((a, b) => a.id - b.id);
  return msgCards;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genMsgCard(), 'acnh-message-cards.json');
}
