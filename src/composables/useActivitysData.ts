import { ref } from 'vue';
import { getActivityName, loadActivityData } from '../services/dataService';
import type { Activity } from '../types/activity';

const allActivitys = ref<Activity[]>([]);
const activityIdMap = ref<Record<number, Activity>>({});
const activityNameMap = ref<Record<string, Activity>>({});
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
          activityNameMap.value[activity.rawName] = activity;
          activityIdMap.value[activity.id] = activity;
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
    activityNameMap,
    activityIdMap,
    loading,
    error,
    loadData,
    getNamesByIds(ids: number[]): string[] {
      let names = ids
        .map((id) => {
          const activity = activityIdMap.value[id];
          return activity ? activity.name : '';
        })
        .filter((name) => name !== '');
      //去重
      names = Array.from(new Set(names));
      return names;
    },
    getOptions() {
      let map: Record<string, number> = {};
      allActivitys.value.forEach((activity) => {
        map[activity.name] = activity.type;
      });
      const activityOptions: { value: string; label: string }[] = [];
      for (const key in map) {
        activityOptions.push({
          value: key,
          label: getActivityName(key),
        });
      }
      activityOptions.sort((a, b) => (map[a.label] || 0) - (map[b.label] || 0));
      return activityOptions;
    },
  };
}
