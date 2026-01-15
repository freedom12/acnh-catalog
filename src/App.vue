<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ItemDetailModal from './components/ItemDetailModal.vue';
import AchievementDetailModal from './components/AchievementDetailModal.vue';
import Tooltip from './components/Tooltip.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import { useItemDetailModal } from './composables/useItemDetailModal';
import { useAchievementDetailModal } from './composables/useAchievementDetailModal';
import { useAppInit } from './composables/useAppInit';

// 回到顶部按钮显示状态
const showBackToTop = ref(false);

// 物品详情模态框
const { isOpen, currentItemId, closeModal } = useItemDetailModal();

// 成就详情模态框
const { isOpen: achievementModalOpen, currentAchievementId, closeModal: closeAchievementModal } = useAchievementDetailModal();

// 应用初始化
const { loading: appLoading, error: appError, initialize } = useAppInit();

// 滚动事件处理
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 防止滚动穿透 - 监听isOpen状态
watch(
  isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  // 初始化应用数据
  await initialize();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  // 清理时恢复滚动
  document.body.style.overflow = '';
});
</script>

<template>
  <!-- 加载中状态 -->
  <div v-if="appLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>正在加载数据...</p>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="appError" class="error-container">
    <p>{{ appError }}</p>
    <button @click="initialize">重试</button>
  </div>

  <!-- 主要内容 -->
  <div v-else class="container">
    <header>
      <h1>动物森友会目录</h1>
    </header>

    <RouterView />

    <!-- 物品详情模态框 -->
    <ItemDetailModal v-if="isOpen" :itemId="currentItemId" @close="closeModal" />

    <!-- 成就详情模态框 -->
    <AchievementDetailModal v-if="achievementModalOpen" :achievementId="currentAchievementId" @close="closeAchievementModal" />

    <!-- 全局 Tooltip -->
    <Tooltip />

    <!-- 全局音频播放器 -->
    <AudioPlayer />

    <!-- 回到顶部按钮 -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="back-to-top"
      aria-label="回到顶部"
    >
      ↑
    </button>
  </div>
</template>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container p {
  color: #e74c3c;
  margin-bottom: var(--spacing-md);
}

.error-container button {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.error-container button:hover {
  background-color: var(--primary-hover);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

h1 {
  color: var(--primary-color);
  font-size: 2.5em;
  margin: 0;
}

.back-to-top {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: var(--transition-normal);
  z-index: 1000;
}

.back-to-top:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
