<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { TabType } from "../components/TabSelector.vue";
import TabSelector from "../components/TabSelector.vue";
import ItemsTab from "./ItemsTab.vue";
import VillagersTab from "./VillagersTab.vue";
import NPCsTab from "./NPCsTab.vue";
import CreaturesTab from "./CreaturesTab.vue";
import ReactionsTab from "./ReactionsTab.vue";
import RecipesTab from "./RecipesTab.vue";
import ConstructionTab from "./ConstructionTab.vue";
import MessageCardTab from "./MessageCardTab.vue";
import ArtworkTab from "./ArtworkTab.vue";

// 当前选中的标签
const activeTab = ref<TabType>("items");

// 回到顶部按钮显示状态
const showBackToTop = ref(false);

// 滚动事件处理
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="container">
    <header>
      <h1>动物森友会目录</h1>
    </header>

    <TabSelector v-model:active-tab="activeTab" />

    <!-- 根据选中的标签显示对应内容 -->
    <ItemsTab v-if="activeTab === 'items'" />
    <VillagersTab v-else-if="activeTab === 'villagers'" />
    <NPCsTab v-else-if="activeTab === 'npcs'" />
    <CreaturesTab v-else-if="activeTab === 'creatures'" />
    <ArtworkTab v-else-if="activeTab === 'artwork'" />
    <ReactionsTab v-else-if="activeTab === 'reactions'" />
    <RecipesTab v-else-if="activeTab === 'recipes'" />
    <ConstructionTab v-else-if="activeTab === 'construction'" />
    <MessageCardTab v-else-if="activeTab === 'messagecard'" />

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
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #4a9b4f;
  font-size: 2.5em;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
  margin-top: 10px;
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #4a9b4f;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background-color: #3a7b3f;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
</style>
