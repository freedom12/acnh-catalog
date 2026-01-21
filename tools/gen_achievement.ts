import { Version, type Achievement, type Tier } from '../src/types/index.js';
import { getAcnhDataCfg } from './acnh/index.js';
import { getSheetDatas } from './excel/excel.js';
import { save, versionMap } from './util.js';

export function genAchievement() {
  let sheetDatas = getSheetDatas();
  const achievementSheetDatas = sheetDatas['Achievements'];
  let acnhDataCfg = getAcnhDataCfg();
  let acnhAchievements = acnhDataCfg['achievements'] as Record<string, any>;
  let achievements: Achievement[] = [];
  for (const sheetData of achievementSheetDatas) {
    let acnhAch = acnhAchievements['a' + sheetData['Internal ID']] as Record<string, any>;
    let name = acnhAch.loc['zh-cn'] || acnhAch.loc['zh'];
    let desc = acnhAch.des['zh-cn'] || acnhAch.des['zh'];
    let tiers: Tier[] = [];
    let count = Number(sheetData['Num of Tiers']);
    for (let i = 1; i <= count; i++) {
      tiers.push({
        num: Number(sheetData[`Tier ${i}`]),
        reward: Number(sheetData[`Tier ${i} Reward`]),
        modifier: sheetData[`Tier ${i} Modifier`],
        nouns: sheetData[`Tier ${i} Noun`].split(';').map((s: string) => s.trim()),
      });
    }
    const achievement: Achievement = {
      id: Number(sheetData['Internal ID']),
      order: Number(sheetData['#']),
      name,
      rawName: sheetData['Internal Name'],
      type: sheetData['Internal Category'],
      ver: versionMap[sheetData['Version Added']] || Version.The100,
      desc,
      criteria: sheetData['Achievement Criteria'],
      isSeq: sheetData['Sequential'] === 'Yes' ? true : false,
      tiers: tiers,
    };
    achievements.push(achievement);
  }
  achievements.sort((a, b) => a.order - b.order);
  return achievements;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genAchievement(), 'acnh-achievements.json');
}
