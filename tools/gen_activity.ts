import { ActivityType, type Activity } from '../src/types/activity.js';
import { getAcnhEventsCfg, getAcnhLocale } from './acnh/index.js';
import { save } from './util.js';

const ActivityTypeMap: Record<string, ActivityType> = {
  season: ActivityType.CalendarSeason,
  crafting: ActivityType.CraftingSeason,
  bush: ActivityType.BloomingSeason,
  zodiac: ActivityType.ZodiacSeason,
  event: ActivityType.BasegameEvent,
  shopping: ActivityType.SpecialEvent,
  nook_shopping: ActivityType.NookShoppingEvent,
};

export function genActivity() {
  let acnhEvents = getAcnhEventsCfg();
  let activitys: Activity[] = [];
  let index = 0;
  for (const [key, event] of Object.entries(
    acnhEvents as Record<string, Record<string, any>>
  )) {
    index++;
    let id = key;
    let group = event.group || key;
    let name = getAcnhLocale(group, 'evt');
    let activity: Activity = {
      id,
      order: index,
      name,
      type: ActivityTypeMap[event.category],
      group,
    };
    activitys.push(activity);
  }
  activitys.sort((a, b) => a.type - b.type || a.order - b.order);
  return activitys;
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  save(genActivity(), 'acnh-activitys.json');
}
