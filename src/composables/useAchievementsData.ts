import { ref, type Ref } from 'vue';
import type { Achievement } from '../types/achievement';
import { loadAchievementsData } from '../services/dataService';

const allAchievements = ref<Achievement[]>([]) as Ref<Achievement[]>;
const achievementIdMap = ref<Record<number, Achievement>>({});
const loading = ref(true);
const error = ref('');
let isDataLoaded = false;
let loadingPromise: Promise<void> | null = null;

export function useAchievementsData() {
  const loadData = async (): Promise<void> => {
    if (isDataLoaded) {
      return;
    }
    // 如果正在加载中，返回现有的 Promise
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = (async () => {
      try {
        loading.value = true;
        error.value = '';
        const achievements = await loadAchievementsData();
        allAchievements.value = achievements;
        // 创建 ID 映射
        achievementIdMap.value = {};
        achievements.forEach(achievement => {
          achievementIdMap.value[achievement.id] = achievement;
        });
        isDataLoaded = true;
      } catch (err) {
        error.value = '加载成就数据失败';
        console.error('加载成就数据失败:', err);
        loadingPromise = null; // 失败时重置，允许重试
      } finally {
        loading.value = false;
      }
    })();

    return loadingPromise;
  };

  return {
    allAchievements,
    achievementIdMap,
    loading,
    error,
    loadData,
  };
}