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
      dateType: event.type || 'special',
      date: event.date,
      nhDate: event.nh,
      shDate: event.sh,
      years: event.years,
      region: event.region,
      flags: event.flags,
    };
    activitys.push(activity);

    // if (event.nos) {
    //   console.log('Nook商店的购物活动:', name);
    // }
    // if (event.region) {
    //   console.log('region:', name, event.region);
    // }
    // if (event.flags) {
    //   console.log('flags:', name, event.flags);
    // }
    // if (event.type === 'weekday') {
    //   const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    //   let date = event.nh || event.date;
    //   let [month, week, day] = date;
    //   let str = `${month + 1}月 第${week}个星期 ${weekdays[day]}`;
    //   // console.log(name, str);
    // } else if (event.type === 'range') {
    //   let curYear = new Date().getFullYear();
    //   let date = event.nh || event.date || event.years[curYear];
    //   if (date) {
    //     if (date.length === 2) {
    //       let [month, day] = date;
    //       let str = `${month + 1}月${day}日`;
    //       // console.log(name, str);
    //     } else if (date.length === 4) {
    //       let [sMonth, sDay, eMonth, eDay] = date;
    //       let str = `${sMonth + 1}月${sDay}日 - ${eMonth + 1}月${eDay}日`;
    //       // console.log(name, str);
    //     } else if (date.length === 3) {
    //       let [sMonth, sDay, dayCount] = date;
    //       const startDate = new Date(2024, sMonth, sDay); // 使用2024年作为基准年（非闰年）
    //       startDate.setDate(startDate.getDate() + dayCount);
    //       const [eMonth, eDay] = [startDate.getMonth(), startDate.getDate()];
    //       let str = `${sMonth + 1}月${sDay}日 - ${eMonth + 1}月${eDay}日`;
    //       // console.log(name, str);
    //     }
    //   } else {
    //     console.log('不是当前年份:', name, event.years);
    //   }
    // } else {
    //   // console.log('unknown type:', event.type, name);
    // }
  }
  activitys.sort((a, b) => a.type - b.type || a.order - b.order);
  return activitys;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  save(genActivity(), 'acnh-activitys.json');
}
