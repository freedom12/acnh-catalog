import { Version, type Achievement, type Tier } from '../src/types/index.js';
import { getAcnhDataCfg } from './acnh/index.js';
import { save, versionMap } from './util.js';
import { achievements as oldAchievements } from 'animal-crossing';

export function genAchievement() {
  let acnhDataCfg = getAcnhDataCfg();
  let acnhAchievements = acnhDataCfg['achievements'] as Record<string, any>;
  let achievements: Achievement[] = [];
  for (const oldAchievement of oldAchievements) {
    let acnhAch = acnhAchievements['a' + oldAchievement.internalId] as Record<
      string,
      any
    >;
    let name = acnhAch.loc['zh-cn'] || acnhAch.loc['zh'];
    let desc = acnhAch.des['zh-cn'] || acnhAch.des['zh'];
    let tiers: Tier[] = [];
    let oldTiers = oldAchievement.tiers;
    for (let i = 1; i <= Number(oldAchievement.numOfTiers); i++) {
      const oldTier = oldTiers[`${i}`];
      if (!oldTier) break;
      tiers.push({
        num: Number(oldTier.required),
        reward: Number(oldTier.reward),
        modifier: oldTier.modifier,
        nouns: oldTier.nouns,
      });
    }
    const achievement: Achievement = {
      id: Number(oldAchievement.internalId),
      order: oldAchievement.num,
      name,
      rawName: oldAchievement.internalName,
      type: oldAchievement.internalCategory,
      ver: versionMap[oldAchievement.versionAdded] || Version.The100,
      desc,
      criteria: oldAchievement.achievementCriteria,
      isSeq: oldAchievement.sequential,
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
