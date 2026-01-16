import { ref } from 'vue';
import { loadActivityData } from '../services/dataService';
import type { Activity } from '../types/activity';

const allActivitys = ref<Activity[]>([]);
const activityGroupMap = ref<Record<string, Activity[]>>({});
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useActivitysData() {
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

  return {
    allActivitys,
    activityGroupMap,
    loading,
    error,
    loadData,
    getOptions() {
      const activityOptions: { value: string; label: string }[] = [];
      for (const [group, activities] of Object.entries(activityGroupMap.value)) {
        activityOptions.push({
          value: group,
          label: activities.length > 0 ? activities[0]!.name : '',
        });
      }
      return activityOptions;
    },
    getGroupsByIds(ids: string[]): string[] {
      let groupSet = new Set<string>();
      ids.forEach((id) => {
        const activities = allActivitys.value.filter((act) => act.id === id);
        activities.forEach((act) => groupSet.add(act.group));
      });
      return Array.from(groupSet);
    },
    getGroupName(group: string): string {
      const activities = activityGroupMap.value[group];
      return activities && activities.length > 0 ? activities[0]!.name : '';
    },
  };
}
