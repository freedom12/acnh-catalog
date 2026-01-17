import { ref } from 'vue';
import { loadActivityData, loadTranslations, translationsCache, getImgUrl } from '../services/dataService';
import type { Activity } from '../types/activity';

const allActivitys = ref<Activity[]>([]);
const activityGroupMap = ref<Record<string, Activity[]>>({});
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useActivitysData() {
  const getTranslation = (key: string, translationMap: Record<string, string> | undefined): string => {
    key = key.trim().toLowerCase();
    return translationMap?.[key] || key;
  };

  const loadData = async () => {
    if (isDataLoaded) {
      return;
    }
    if (loadingPromise) {
      return loadingPromise;
    }
    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = '';

        allActivitys.value = await loadActivityData();
        await loadTranslations();
        allActivitys.value.forEach((activity) => {
          if (!activityGroupMap.value[activity.group]) {
            activityGroupMap.value[activity.group] = [];
          }
          activityGroupMap.value[activity.group]?.push(activity);
        });

        isDataLoaded = true;
      } catch (e) {
        error.value = '加载数据失败';
        console.error('加载数据失败:', e);
        loadingPromise = null;
      } finally {
        loading.value = false;
      }
    })();

    return loadingPromise;
  };

  const getGroupName = (group: string, isWithIcon: boolean = false): string => {
    const activities = activityGroupMap.value[group];
    if (!activities || activities.length === 0) return '';
    const activity = activities[0]!;
    let name = activity.name;
    const parts: string[] = [];
    if (activity.region) {
      const translatedRegion = getTranslation(activity.region, translationsCache?.regions);
      parts.push(translatedRegion);
    }
    if (activity.flags && activity.flags.length > 0) {
      if (isWithIcon) {
        const iconFlags = activity.flags.map(flag => {
          const translatedFlag = getTranslation(flag, translationsCache?.flags);
          const iconUrl = getImgUrl(`img/icon/flag/${flag}.png`);
          return `<img src="${iconUrl}" title="${translatedFlag}" class="inline-icon" />`;
        });
        parts.push(iconFlags.join(''));
      } else {
        const translatedFlags = activity.flags.map(flag => getTranslation(flag, translationsCache?.flags));
        parts.push(translatedFlags.join(','));
      }
    }
    if (parts.length > 0) {
      name += '[' + parts.join(',') + ']';
    }
    return name;
  };

  return {
    allActivitys,
    activityGroupMap,
    loading,
    error,
    loadData,
    getGroupsByIds(ids: string[]): string[] {
      let groupSet = new Set<string>();
      ids.forEach((id) => {
        const activities = allActivitys.value.filter((act) => act.id === id);
        activities.forEach((act) => groupSet.add(act.group));
      });
      return Array.from(groupSet);
    },
    getGroupName,
    getOptions() {
      const activityOptions: { value: string; label: string }[] = [];
      for (const group of Object.keys(activityGroupMap.value)) {
        activityOptions.push({
          value: group,
          label: getGroupName(group),
        });
      }
      return activityOptions;
    },
    getDateStr(activity: Activity, hemisphere: 'nh' | 'sh' = 'nh'): string {
      let date: Activity['date'] | undefined;
      if (hemisphere === 'nh') {
        date = activity.nhDate;
      } else {
        date = activity.shDate;
      }
      let curYear = new Date().getFullYear();
      date = date || activity.date || activity.years?.[curYear];
      let year = 0;
      if (!date) {
        // activity.years中选择首个
        console.log('使用years中的首个日期:', activity.name, activity.years);
        if (activity.years) {
          year = Object.keys(activity.years)[0];
          date = activity.years[year];
        }
        if (!date) {
          return '';
        }
      }
      let dateStr = '';
      if (activity.dateType === 'special') {
        dateStr = '特殊活动';
      } else if (activity.dateType === 'weekday') {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        let [month, week, day] = date as [number, number, number];
        dateStr = `${month + 1}月 第${week}个星期 ${weekdays[day]}`;
      } else if (activity.dateType === 'range') {
        if ((date as number[]).length === 2) {
          let [month, day] = date as [number, number];
          dateStr = `${month + 1}月${day}日`;
        } else if ((date as number[]).length === 4) {
          let [sMonth, sDay, eMonth, eDay] = date as [number, number, number, number];
          dateStr = `${sMonth + 1}月${sDay}日 - ${eMonth + 1}月${eDay}日`;
        } else if ((date as number[]).length === 3) {
          let [sMonth, sDay, dayCount] = date as [number, number, number];
          const startDate = new Date(curYear, sMonth, sDay);
          startDate.setDate(startDate.getDate() + dayCount);
          const [eMonth, eDay] = [startDate.getMonth(), startDate.getDate()];
          dateStr = `${sMonth + 1}月${sDay}日 - ${eMonth + 1}月${eDay}日`;
        }
      }
      if (year > 0) {
        dateStr = `${year}年 ${dateStr}`;
      }
      return dateStr;
    },
  };
}