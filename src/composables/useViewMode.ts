import { ref, watch } from 'vue';

// 全局共享的视图模式状态
const viewMode = ref<'detailed' | 'simple'>(
  (localStorage.getItem('viewMode') as 'detailed' | 'simple') || 'detailed'
);

// 监听变化并持久化
watch(viewMode, (newMode) => {
  localStorage.setItem('viewMode', newMode);
});

export function useViewMode() {
  return {
    viewMode,
  };
}
