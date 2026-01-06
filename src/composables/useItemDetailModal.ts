import { ref } from 'vue';

const isOpen = ref(false);
const currentItemId = ref<number | null>(null);

export function useItemDetailModal() {
  const openModal = (itemId: number) => {
    currentItemId.value = itemId;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    // 延迟清空ID，等动画结束
    setTimeout(() => {
      currentItemId.value = null;
    }, 300);
  };

  return {
    isOpen,
    currentItemId,
    openModal,
    closeModal,
  };
}
