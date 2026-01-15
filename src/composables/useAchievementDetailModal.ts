import { ref } from 'vue';

const isOpen = ref(false);
const currentAchievementId = ref<number | null>(null);

export function useAchievementDetailModal() {
  const openModal = (achievementId: number) => {
    currentAchievementId.value = achievementId;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    // 延迟清空ID，等动画结束
    setTimeout(() => {
      currentAchievementId.value = null;
    }, 300);
  };

  return {
    isOpen,
    currentAchievementId,
    openModal,
    closeModal,
  };
}