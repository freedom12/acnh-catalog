<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ItemDetailModal from './components/ItemDetailModal.vue';
import Tooltip from './components/Tooltip.vue';
import { useItemDetailModal } from './composables/useItemDetailModal';

// 回到顶部按钮显示状态
const showBackToTop = ref(false);

// 物品详情模态框
const { isOpen, currentItemId, closeModal } = useItemDetailModal();

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

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  // 清理时恢复滚动
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="container">
    <header>
      <h1>动物森友会目录</h1>
    </header>

    <RouterView />

    <!-- 物品详情模态框 -->
    <ItemDetailModal v-if="isOpen" :itemId="currentItemId" @close="closeModal" />

    <!-- 全局 Tooltip -->
    <Tooltip />

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
